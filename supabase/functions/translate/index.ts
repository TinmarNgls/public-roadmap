
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Translation request received');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const requestBody = await req.json();
    
    // Support both single text and batch translation
    const isBatch = Array.isArray(requestBody.texts);
    const texts = isBatch ? requestBody.texts : [requestBody.text];
    const { fromLanguage, toLanguage } = requestBody;

    console.log(`${isBatch ? 'Batch t' : 'T'}ranslating ${texts.length} text(s) from ${fromLanguage} to ${toLanguage}`);

    if (!texts.length || !fromLanguage || !toLanguage) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: text(s), fromLanguage, toLanguage' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // If same language, return original texts
    if (fromLanguage === toLanguage) {
      const result = isBatch 
        ? { translations: texts }
        : { translatedText: texts[0] };
      
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare the prompt for batch translation
    const prompt = isBatch && texts.length > 1
      ? `Translate each of the following texts from ${fromLanguage} to ${toLanguage}. Return only the translations, one per line, in the same order:

${texts.map((text, index) => `${index + 1}. ${text}`).join('\n')}`
      : `Translate the following text from ${fromLanguage} to ${toLanguage}. Only return the translated text, nothing else:

${texts[0]}`;

    console.log('Calling OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. ${isBatch && texts.length > 1 
              ? 'When translating multiple texts, return each translation on a separate line, numbered to match the input order. Maintain the original tone and meaning for each text.'
              : 'Only return the translated text, nothing else. Maintain the original tone and meaning.'
            }`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: Math.min(4000, texts.reduce((acc, text) => acc + text.length, 0) * 2),
      }),
    });

    console.log('OpenAI response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      
      // Return original texts as fallback
      const fallbackResult = isBatch 
        ? { translations: texts }
        : { translatedText: texts[0] };
      
      return new Response(
        JSON.stringify(fallbackResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('OpenAI response data:', data);
    
    const translatedContent = data.choices[0].message.content.trim();
    
    let result;
    if (isBatch && texts.length > 1) {
      // Parse batch response - split by lines and clean up numbering
      const translations = translatedContent
        .split('\n')
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 0);
      
      // Ensure we have the same number of translations as inputs
      while (translations.length < texts.length) {
        const missingIndex = translations.length;
        translations.push(texts[missingIndex]);
      }
      
      result = { translations: translations.slice(0, texts.length) };
      console.log('Batch translations:', result.translations);
    } else {
      result = { translatedText: translatedContent };
      console.log('Single translation:', result.translatedText);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in translate function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
