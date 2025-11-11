import React, { FC, useState } from 'react';
import { 
    CaseIcon, PenSquareIcon, RocketIcon, UtensilsIcon, ServerIcon, IdCardIcon,
    BookOpenIcon, UserSquareIcon, MicIcon, ChevronDownIcon 
} from '../Icons';

type Template = {
  id: string;
  name: string;
  description: string;
  icon: FC<{ className?: string }>;
  prompt: string;
  category: 'Business' | 'Personal' | 'Content';
};

const templates: Template[] = [
  {
    id: 'landing-page', name: 'Landing Page', description: 'For products, services, or startups.', icon: RocketIcon, category: 'Business',
    prompt: "A professional landing page for a new SaaS product called 'SyncFlow'. It must feature a hero section, features, a pricing table with three tiers, and a footer. The pricing tiers should have a functional toggle to switch between monthly and yearly pricing, which updates the displayed prices."
  },
  {
    id: 'restaurant', name: 'Restaurant', description: 'For a local cafe, bar, or eatery.', icon: UtensilsIcon, category: 'Business',
    prompt: "An elegant website for an Italian restaurant 'La Trattoria'. It needs an 'Our Menu' section with functional buttons to filter dishes by category (e.g., Appetizers, Pasta, Desserts). Also include a photo gallery and a 'Contact & Hours' section. All interactive elements must be functional."
  },
  {
    id: 'saas', name: 'SaaS Startup', description: 'For a modern tech company.', icon: ServerIcon, category: 'Business',
    prompt: "A sleek website for a tech startup 'QuantumLeap AI'. Key sections: a hero with animated text, testimonials, a functional FAQ accordion that expands/collapses answers, and a 'Request a Demo' form with client-side validation (e.g., checking for a valid email format)."
  },
  {
    id: 'tech-conference', name: 'Tech Conference', description: 'For events, meetups, and summits.', icon: MicIcon, category: 'Business',
    prompt: "A website for a tech conference 'InnovateSphere 2025'. Include a 'Speakers' section, a multi-track 'Agenda' with functional tabs to switch between different days, and a countdown timer in the hero section that actively counts down to the event date. The agenda filtering must be functional."
  },
  {
    id: 'portfolio', name: 'Portfolio', description: 'Photographers, artists, designers.', icon: CaseIcon, category: 'Personal',
    prompt: "A portfolio for a photographer Jane Doe. It needs a filterable gallery where users can click buttons to view different categories of photos (e.g., Portraits, Landscapes). The contact form must have functional client-side validation to ensure the email field is correctly formatted before submission."
  },
  {
    id: 'resume', name: 'Digital Resume', description: 'A professional online CV.', icon: IdCardIcon, category: 'Personal',
    prompt: "A professional single-page digital resume for software engineer Alex Ray. Include an interactive timeline for professional experience and a 'skills' section where clicking a skill reveals a short description or list of related projects."
  },
  {
    id: 'portfolio-blog', name: 'Portfolio + Blog', description: 'Showcase work & share thoughts.', icon: UserSquareIcon, category: 'Personal',
    prompt: "A hybrid personal portfolio and blog. The site needs a 'Projects' page and a 'Blog' page. The blog page must include a functional search bar to filter posts by title."
  },
  {
    id: 'blog', name: 'Blog', description: 'For writers, travelers, hobbyists.', icon: PenSquareIcon, category: 'Content',
    prompt: "A clean blog website. It needs a homepage listing recent posts, and a dark/light mode toggle button that is fully functional and uses localStorage to remember the user's preference."
  },
  {
    id: 'recipe-blog', name: 'Recipe Blog', description: 'For foodies & culinary artists.', icon: BookOpenIcon, category: 'Content',
    prompt: "A recipe blog website. The recipe page template must include an interactive checklist for ingredients and functional buttons to adjust serving sizes, which should dynamically update the ingredient quantities."
  }
];

const groupedTemplates = templates.reduce((acc, template) => {
  if (!acc[template.category]) {
    acc[template.category] = [];
  }
  acc[template.category].push(template);
  return acc;
}, {} as Record<Template['category'], Template[]>);


type TemplateSelectorProps = {
  onSelectTemplate: (prompt: string) => void;
  currentPrompt: string;
};

const TemplateSelector: FC<TemplateSelectorProps> = ({ onSelectTemplate, currentPrompt }) => {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(['Business']));

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  return (
    <div>
      <label className="text-sm font-semibold text-[var(--gotidea-text-muted)] mb-3 block">Or start with a template</label>
      <div className="space-y-2">
        {Object.entries(groupedTemplates).map(([category, templatesInCategory]) => {
          const isOpen = openCategories.has(category);
          return (
            <div key={category} className="bg-[var(--gotidea-bg)] border border-[var(--gotidea-border)] rounded-lg">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex justify-between items-center p-3 text-left font-semibold"
              >
                <span>{category}</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                   <div className="p-3 pt-0 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {templatesInCategory.map((template) => {
                      const isSelected = currentPrompt === template.prompt;
                      return (
                        <button
                          key={template.id}
                          onClick={() => onSelectTemplate(template.prompt)}
                          title={template.prompt}
                          className={`p-2 rounded-lg border-2 text-left transition-all duration-200 transform hover:shadow-[var(--gotidea-shadow)] flex flex-col justify-start items-start ${
                            isSelected
                              ? 'border-[var(--gotidea-primary)] bg-[var(--gotidea-bg-alt)] ring-2 ring-[var(--gotidea-primary)]/20 -translate-y-0.5'
                              : 'border-[var(--gotidea-border)] bg-[var(--gotidea-bg-alt)] hover:border-[var(--gotidea-primary)]/50 hover:-translate-y-0.5'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <template.icon className="w-5 h-5 text-[var(--gotidea-primary)]" />
                            <h3 className="font-semibold text-sm text-[var(--gotidea-text)]">{template.name}</h3>
                          </div>
                          <p className="text-xs text-[var(--gotidea-text-muted)]">{template.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;