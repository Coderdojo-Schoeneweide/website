import React, { useState } from 'react';
import WorkshopModal from './WorkshopModal.jsx';

export default function WorkshopModalIsland({ workshops }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [photo, setPhoto] = useState('');

  // Systematic markdown parser for workshop content
  const parseMarkdownContent = (workshop) => {
    // 1. Parse Hugo shortcodes - {{< figure >}}
    let html = workshop.content.replace(
      /\{\{<\s*figure\s+([^>]+)\s*>}}/g,
      (match, attributes) => {
        const attrs = {};
        // Parse attributes: width="50%" src="images/file.png" title="Description"
        const attrMatches = attributes.matchAll(/(\w+)="([^"]+)"/g);
        for (const attrMatch of attrMatches) {
          attrs[attrMatch[1]] = attrMatch[2];
        }

        const width = attrs.width || '100%';
        const src = attrs.src || '';
        const title = attrs.title || '';
        const alt = attrs.alt || title || '';

        // Convert workshop-relative image paths to public paths
        const imagePath =
          src.startsWith('images/') ?
            `/workshops/${workshop.folder}/${src}`
          : src;

        return `
          <figure class="my-6 text-center" style="width: ${width}; margin-left: auto; margin-right: auto;">
            <img 
              src="${imagePath}" 
              alt="${alt}" 
              title="${title}"
              class="rounded-lg shadow-md max-w-full h-auto"
            />
            ${title ? `<figcaption class="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">${title}</figcaption>` : ''}
          </figure>
        `;
      },
    );

    // 2. Parse markdown links [text](url) and make them clickable
    html = html.replace(
      /\[([^\]]+)]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>',
    );

    // 3. Parse plain URLs and make them clickable (but avoid URLs already in HTML)
    // Split by existing HTML tags to avoid processing URLs inside attributes
    const parts = html.split(/(<[^>]*>)/g);
    html = parts
      .map((part, index) => {
        // Only process non-HTML parts (even indices)
        if (index % 2 === 0) {
          return part.replace(
            /(https?:\/\/[^\s<>"]+)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline break-all">$1</a>',
          );
        }
        return part;
      })
      .join('');

    // 4. Parse markdown headers
    html = html.replace(
      /^### (.*$)/gim,
      '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-900 dark:text-white">$1</h3>',
    );
    html = html.replace(
      /^## (.*$)/gim,
      '<h2 class="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">$1</h2>',
    );
    html = html.replace(
      /^# (.*$)/gim,
      '<h1 class="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">$1</h1>',
    );

    // 5. Parse markdown lists (improved handling)
    // First, collect all list items
    const lines = html.split('\n');
    let inList = false;
    let listItems = [];
    let processedLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.match(/^[*-]\s+/)) {
        // This is a list item
        if (!inList) {
          inList = true;
          listItems = [];
        }
        listItems.push(line.replace(/^[*-]\s+/, ''));
      } else {
        // Not a list item
        if (inList) {
          // Close the current list
          const listHtml = `<ul class="list-disc pl-6 space-y-2 my-4">\n${listItems.map((item) => `  <li class="text-slate-700 dark:text-slate-200">${item}</li>`).join('\n')}\n</ul>`;
          processedLines.push(listHtml);
          inList = false;
          listItems = [];
        }
        if (line) {
          processedLines.push(line);
        }
      }
    }

    // Close any remaining list
    if (inList && listItems.length > 0) {
      const listHtml = `<ul class="list-disc pl-6 space-y-2 my-4">\n${listItems.map((item) => `  <li class="text-slate-700 dark:text-slate-200">${item}</li>`).join('\n')}\n</ul>`;
      processedLines.push(listHtml);
    }

    html = processedLines.join('\n');

    // 6. Convert paragraphs (handle double line breaks)
    html = html.replace(/\n\s*\n/g, '\n\n'); // Normalize line breaks
    const paragraphs = html.split('\n\n').filter((p) => p.trim());

    html = paragraphs
      .map((paragraph) => {
        const trimmed = paragraph.trim();
        // Don't wrap already-wrapped HTML elements
        if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
          return trimmed;
        }
        // Don't wrap empty content
        if (!trimmed) {
          return '';
        }
        return `<p class="mb-4 text-slate-700 dark:text-slate-200 leading-relaxed">${trimmed}</p>`;
      })
      .join('\n');

    return html;
  };

  // Load content when a workshop is selected
  const handleOpen = async (workshop) => {
    setSelected(workshop);
    setOpen(true);

    // Use the markdown content directly and parse it systematically
    const content = workshop.content || workshop.body || '';

    // Parse the markdown content systematically
    const parsedHtml = parseMarkdownContent(workshop);

    // Wrap the content in a container with proper styling
    const formattedContent = `<div class="workshop-content prose dark:prose-invert max-w-none">${parsedHtml}</div>`;

    setHtmlContent(formattedContent);
    setPhoto(workshop.image);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    setHtmlContent('');
    setPhoto('');
  };

  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {workshops.map((workshop) => (
          <div
            key={workshop.title}
            className="hover:border-primary-400 flex min-h-[320px] cursor-pointer flex-col items-center rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-md transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            onClick={() => handleOpen(workshop)}
          >
            <img
              src={workshop.image}
              alt={workshop.title}
              className="mb-4 h-40 w-full rounded-xl object-cover"
            />
            <h3 className="text-accent-900 mb-2 text-xl font-bold dark:text-gray-100">
              {workshop.title}
            </h3>
            <p className="mb-2 flex-1 text-base text-gray-600 dark:text-gray-300">
              {workshop.description}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {workshop.tags &&
                workshop.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary-500 rounded-full px-3 py-1 text-xs font-semibold text-white shadow"
                  >
                    {tag}
                  </span>
                ))}
            </div>
            <div className="mt-4 flex justify-center gap-3">
              <span className="bg-accent-600 rounded-full px-3 py-1 text-xs font-semibold text-white">
                {workshop.age}
              </span>
              <span className="bg-accent-600 rounded-full px-3 py-1 text-xs font-semibold text-white">
                {workshop.duration}
              </span>
            </div>
          </div>
        ))}
      </div>
      <WorkshopModal
        open={open}
        onClose={handleClose}
        htmlContent={htmlContent}
        photo={photo}
        title={selected?.title}
      />
    </>
  );
}
