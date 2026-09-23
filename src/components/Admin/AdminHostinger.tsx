import React, { useState } from 'react';
import { 
  Download, 
  Server, 
  Database, 
  Check, 
  FileCode, 
  ShieldCheck, 
  ExternalLink, 
  Terminal,
  Layers,
  Copy
} from 'lucide-react';
import { useBlog } from '../../context/BlogContext';

export const AdminHostinger: React.FC = () => {
  const { articles, categories, siteSettings, adUnits } = useBlog();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Generate MySQL dump with actual current articles & categories
  const generateSqlDump = () => {
    let sql = `-- ==============================================================
-- Green Gardan - UK Gardening & Lifestyle Blog
-- Hostinger Shared Hosting MySQL Database Dump
-- Generated on: ${new Date().toISOString()}
-- Compatible with MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+
-- ==============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table structure for \`categories\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`categories\` (
  \`id\` varchar(64) NOT NULL,
  \`name\` varchar(128) NOT NULL,
  \`slug\` varchar(128) NOT NULL UNIQUE,
  \`description\` text DEFAULT NULL,
  \`image\` varchar(512) DEFAULT NULL,
  \`seo_title\` varchar(255) DEFAULT NULL,
  \`meta_description\` text DEFAULT NULL,
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Dumping data for \`categories\`
-- --------------------------------------------------------
`;

    categories.forEach(c => {
      sql += `INSERT INTO \`categories\` (\`id\`, \`name\`, \`slug\`, \`description\`, \`image\`, \`seo_title\`, \`meta_description\`) VALUES
('${c.id}', '${c.name.replace(/'/g, "\\'")}', '${c.slug}', '${c.description.replace(/'/g, "\\'")}', '${c.image}', '${(c.seoTitle || '').replace(/'/g, "\\'")}', '${(c.metaDescription || '').replace(/'/g, "\\'")}');\n`;
    });

    sql += `\n-- --------------------------------------------------------
-- Table structure for \`articles\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`articles\` (
  \`id\` varchar(64) NOT NULL,
  \`title\` varchar(255) NOT NULL,
  \`slug\` varchar(255) NOT NULL UNIQUE,
  \`category_slug\` varchar(128) NOT NULL,
  \`category_name\` varchar(128) NOT NULL,
  \`excerpt\` text NOT NULL,
  \`content\` longtext NOT NULL,
  \`featured_image\` varchar(512) NOT NULL,
  \`alt_text\` varchar(255) DEFAULT NULL,
  \`author_name\` varchar(128) DEFAULT 'Green Gardan Editorial Team',
  \`publish_date\` date NOT NULL,
  \`updated_date\` date DEFAULT NULL,
  \`reading_time\` varchar(32) DEFAULT '5 min read',
  \`tags\` varchar(512) DEFAULT NULL,
  \`status\` enum('published','draft') DEFAULT 'published',
  \`is_featured\` tinyint(1) DEFAULT 0,
  \`is_popular\` tinyint(1) DEFAULT 0,
  \`seo_title\` varchar(255) DEFAULT NULL,
  \`meta_description\` text DEFAULT NULL,
  \`focus_keyword\` varchar(128) DEFAULT NULL,
  \`faqs_json\` longtext DEFAULT NULL,
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_category\` (\`category_slug\`),
  KEY \`idx_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Dumping data for \`articles\` (${articles.length} records)
-- --------------------------------------------------------
`;

    articles.forEach(a => {
      const faqsJson = JSON.stringify(a.faqs || []).replace(/'/g, "\\'");
      sql += `INSERT INTO \`articles\` (\`id\`, \`title\`, \`slug\`, \`category_slug\`, \`category_name\`, \`excerpt\`, \`content\`, \`featured_image\`, \`alt_text\`, \`publish_date\`, \`updated_date\`, \`reading_time\`, \`tags\`, \`status\`, \`is_featured\`, \`is_popular\`, \`seo_title\`, \`meta_description\`, \`focus_keyword\`, \`faqs_json\`) VALUES
('${a.id}', '${a.title.replace(/'/g, "\\'")}', '${a.slug}', '${a.categorySlug}', '${a.categoryName.replace(/'/g, "\\'")}', '${a.excerpt.replace(/'/g, "\\'")}', '${a.content.replace(/'/g, "\\'")}', '${a.featuredImage}', '${(a.altText || '').replace(/'/g, "\\'")}', '${a.publishDate}', '${a.updatedDate || a.publishDate}', '${a.readingTime}', '${a.tags.join(',')}', '${a.status}', ${a.isFeatured ? 1 : 0}, ${a.isPopular ? 1 : 0}, '${(a.seoTitle || '').replace(/'/g, "\\'")}', '${(a.metaDescription || '').replace(/'/g, "\\'")}', '${(a.focusKeyword || '').replace(/'/g, "\\'")}', '${faqsJson}');\n`;
    });

    sql += `\n-- --------------------------------------------------------
-- Table structure for \`ad_units\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`ad_units\` (
  \`id\` varchar(64) NOT NULL,
  \`name\` varchar(128) NOT NULL,
  \`slot_id\` varchar(64) NOT NULL,
  \`format\` varchar(32) DEFAULT 'responsive',
  \`placement\` varchar(64) NOT NULL,
  \`device\` varchar(32) DEFAULT 'all',
  \`status\` enum('active','disabled') DEFAULT 'active',
  \`label\` varchar(64) DEFAULT 'Advertisement',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Dumping data for \`ad_units\`
-- --------------------------------------------------------
`;

    adUnits.forEach(u => {
      const label = u.customLabel || u.label || 'Advertisement';
      sql += `INSERT INTO \`ad_units\` (\`id\`, \`name\`, \`slot_id\`, \`format\`, \`placement\`, \`device\`, \`status\`, \`label\`) VALUES
('${u.id}', '${u.name.replace(/'/g, "\\'")}', '${u.slotId}', '${u.format}', '${u.placement}', '${u.device}', '${u.status}', '${label}');\n`;
    });

    sql += `\nCOMMIT;\n`;
    return sql;
  };

  const handleDownloadSql = () => {
    const sql = generateSqlDump();
    const blob = new Blob([sql], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'greengardan_hostinger_schema.sql');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadHtaccess = () => {
    const htaccess = `# Green Gardan - Hostinger Shared Hosting Apache Configuration
# Enable Rewrite Engine
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Force HTTPS
  RewriteCond %{HTTPS} !=on
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # Don't rewrite real existing files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  # Route all requests to index.html for Single Page Application
  RewriteRule ^ index.html [L]
</IfModule>

# Browser Caching for Fast Performance & Core Web Vitals
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access 1 year"
  ExpiresByType image/jpeg "access 1 year"
  ExpiresByType image/gif "access 1 year"
  ExpiresByType image/png "access 1 year"
  ExpiresByType image/webp "access 1 year"
  ExpiresByType text/css "access 1 month"
  ExpiresByType application/javascript "access 1 month"
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
`;
    const blob = new Blob([htaccess], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '.htaccess');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-editorial text-[#14281c]">
          Hostinger Shared Hosting Deployment Center
        </h2>
        <p className="text-xs text-[#52796f]">
          Everything required to deploy Green Gardan to your Hostinger web hosting account (hPanel, Apache, MySQL, PHP).
        </p>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#74c69d]">
              <Database className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">MySQL Database Export</span>
            </div>
            <h3 className="text-xl font-bold font-editorial mb-2">
              Download schema.sql
            </h3>
            <p className="text-xs text-[#d8eedb] leading-relaxed mb-6">
              Contains the complete database table structure and all {articles.length} articles, categories, and ad unit settings formatted for phpMyAdmin import.
            </p>
          </div>

          <button
            onClick={handleDownloadSql}
            className="w-full py-3 rounded-xl bg-[#52b788] hover:bg-[#40916c] text-[#081c15] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download schema.sql ({articles.length} Guides Dump)</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#e2ece2] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#2d6a4f]">
              <Server className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Server Configuration</span>
            </div>
            <h3 className="text-xl font-bold font-editorial text-[#14281c] mb-2">
              Download .htaccess
            </h3>
            <p className="text-xs text-[#52796f] leading-relaxed mb-6">
              Pre-configured Apache rewrite rules for clean URLs, HTTPS redirection, aggressive browser caching, and Google AdSense compliance headers.
            </p>
          </div>

          <button
            onClick={handleDownloadHtaccess}
            className="w-full py-3 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download .htaccess Configuration</span>
          </button>
        </div>
      </div>

      {/* Step-by-Step Deployment Instructions */}
      <div className="bg-white rounded-2xl border border-[#e2ece2] p-6 sm:p-8 shadow-2xs space-y-6">
        <h3 className="text-lg font-bold font-editorial text-[#14281c] border-b border-neutral-100 pb-3">
          Step-by-Step Guide: Deploying to Hostinger Shared Hosting
        </h3>

        <div className="space-y-6 text-xs text-[#2b4233] leading-relaxed">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <span className="w-7 h-7 rounded-full bg-[#1b4332] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </span>
            <div className="space-y-1.5 flex-grow">
              <h4 className="font-bold text-sm text-[#14281c]">Build Production Assets</h4>
              <p>
                Run <code className="bg-neutral-100 px-2 py-0.5 rounded font-mono text-[11px]">npm run build</code> in the project directory. This compiles the entire application into the <code className="bg-neutral-100 px-2 py-0.5 rounded font-mono text-[11px]">dist/</code> folder.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <span className="w-7 h-7 rounded-full bg-[#1b4332] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </span>
            <div className="space-y-1.5 flex-grow">
              <h4 className="font-bold text-sm text-[#14281c]">Upload to Hostinger public_html</h4>
              <p>
                Log into your Hostinger hPanel &gt; <strong>File Manager</strong> (or connect via FTP / FileZilla). Upload the files from the <code className="bg-neutral-100 px-2 py-0.5 rounded font-mono text-[11px]">dist/</code> folder directly into your website's <code className="bg-neutral-100 px-2 py-0.5 rounded font-mono text-[11px]">public_html</code> root directory.
              </p>
              <p className="text-neutral-500 text-[11px]">
                Ensure your <code className="bg-neutral-100 px-1.5 py-0.5 rounded font-mono">.htaccess</code> file is also placed in <code className="bg-neutral-100 px-1.5 py-0.5 rounded font-mono">public_html</code> to enable SPA routing.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <span className="w-7 h-7 rounded-full bg-[#1b4332] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              3
            </span>
            <div className="space-y-1.5 flex-grow">
              <h4 className="font-bold text-sm text-[#14281c]">Set up MySQL Database in Hostinger hPanel</h4>
              <p>
                Go to hPanel &gt; <strong>Databases</strong> &gt; <strong>MySQL Databases</strong>. Create a new database (e.g. <code className="bg-neutral-100 px-2 py-0.5 rounded font-mono text-[11px]">u123456_greengardan</code>) and user.
              </p>
              <p>
                Open <strong>phpMyAdmin</strong> from hPanel, select your database, click the <strong>Import</strong> tab, and upload the <code className="bg-neutral-100 px-2 py-0.5 rounded font-mono text-[11px]">greengardan_hostinger_schema.sql</code> file you downloaded above.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-4">
            <span className="w-7 h-7 rounded-full bg-[#1b4332] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              4
            </span>
            <div className="space-y-1.5 flex-grow">
              <h4 className="font-bold text-sm text-[#14281c]">Enable SSL &amp; Verify AdSense</h4>
              <p>
                In Hostinger hPanel &gt; <strong>Security</strong> &gt; <strong>SSL</strong>, ensure Free Let's Encrypt SSL is active.
              </p>
              <p>
                Ensure your <code className="bg-neutral-100 px-2 py-0.5 rounded font-mono text-[11px]">ads.txt</code> file is accessible at <code className="bg-neutral-100 px-2 py-0.5 rounded font-mono text-[11px]">https://yourdomain.co.uk/ads.txt</code> for Google crawlers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
