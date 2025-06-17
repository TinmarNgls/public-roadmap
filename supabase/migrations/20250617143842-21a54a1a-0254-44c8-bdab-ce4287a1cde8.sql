
-- Add translated title and content columns to changelog_announcements table
ALTER TABLE public.changelog_announcements 
  ADD COLUMN title_fr TEXT,
  ADD COLUMN title_en TEXT,
  ADD COLUMN title_pt_pt TEXT,
  ADD COLUMN title_pt_br TEXT,
  ADD COLUMN content_fr TEXT,
  ADD COLUMN content_en TEXT,
  ADD COLUMN content_pt_pt TEXT,
  ADD COLUMN content_pt_br TEXT;

-- Update existing data with English content (assuming current content is in English)
UPDATE public.changelog_announcements 
SET 
  title_en = title,
  content_en = content;

-- Add some sample French translations for existing entries
UPDATE public.changelog_announcements 
SET 
  title_fr = 'Version 2.1.0 Publiée',
  content_fr = '<p><strong>Améliorations majeures et nouvelles fonctionnalités :</strong></p>
<ul>
<li>Ajout d''un nouveau tableau de bord avec des analyses améliorées 📊</li>
<li>Implémentation du support du <em>mode sombre</em> sur toutes les pages</li>
<li>Amélioration de la réactivité mobile pour une meilleure expérience utilisateur</li>
<li>Consultez notre <a href="https://example.com/docs" target="_blank">documentation mise à jour</a></li>
</ul>'
WHERE title = 'Version 2.1.0 Released';

UPDATE public.changelog_announcements 
SET 
  title_fr = 'Mise à jour Bonne Année',
  content_fr = '<p><strong>Corrections de bugs et améliorations de performance :</strong></p>
<ul>
<li>Correction des problèmes de connexion sur le navigateur Safari 🔧</li>
<li>Amélioration des temps de chargement de page de <strong>40%</strong></li>
<li>Amélioration de la gestion d''erreurs sur toute la plateforme</li>
</ul>'
WHERE title = 'Happy New Year Update';

UPDATE public.changelog_announcements 
SET 
  title_fr = 'Support de Texte Riche Ajouté',
  content_fr = '<p>Nous sommes ravis d''annoncer le <strong>support de texte riche</strong> dans notre changelog ! 🎉</p>
<p>Vous pouvez maintenant utiliser :</p>
<ul>
<li><strong>Texte en gras</strong> pour l''emphase</li>
<li><em>Texte en italique</em> pour le style</li>
<li><a href="https://example.com" target="_blank">Liens cliquables</a></li>
<li>Emojis pour le plaisir ! 😊</li>
</ul>
<p><em>Cela rend nos mises à jour beaucoup plus engageantes et plus faciles à lire.</em></p>'
WHERE title = 'Rich Text Support Added';
