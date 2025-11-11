import { Card } from "@/components/ui/card";
import { Layout, LayoutDashboard, FileText } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  code: string;
}

const templates: Template[] = [
  {
    id: "landing",
    name: "Landing Page",
    description: "Modern landing page with hero, features, and CTA",
    icon: <Layout className="w-8 h-8" />,
    code: `import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Build Amazing Products
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create stunning web applications with our powerful tools and AI assistance
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Fast Development</h3>
            <p className="text-gray-600">Build and deploy in minutes, not hours</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">AI Powered</h3>
            <p className="text-gray-600">Leverage AI to write code faster</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Responsive</h3>
            <p className="text-gray-600">Works perfectly on all devices</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;`
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Admin dashboard with sidebar and stats",
    icon: <LayoutDashboard className="w-8 h-8" />,
    code: `import React from 'react';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
        <nav className="space-y-4">
          <a href="#" className="block py-2 px-4 rounded bg-blue-600">Overview</a>
          <a href="#" className="block py-2 px-4 rounded hover:bg-gray-800">Analytics</a>
          <a href="#" className="block py-2 px-4 rounded hover:bg-gray-800">Users</a>
          <a href="#" className="block py-2 px-4 rounded hover:bg-gray-800">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Overview</h1>
        
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-3xl font-bold">1,234</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Revenue</p>
            <p className="text-3xl font-bold">$12.5K</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Active Projects</p>
            <p className="text-3xl font-bold">42</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Completion Rate</p>
            <p className="text-3xl font-bold">95%</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span>New user registered</span>
              <span className="text-gray-500">2 mins ago</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Project completed</span>
              <span className="text-gray-500">1 hour ago</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Payment received</span>
              <span className="text-gray-500">3 hours ago</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;`
  },
  {
    id: "blog",
    name: "Blog",
    description: "Blog layout with posts and sidebar",
    icon: <FileText className="w-8 h-8" />,
    code: `import React from 'react';

const Blog = () => {
  const posts = [
    { id: 1, title: 'Getting Started with React', excerpt: 'Learn the basics of React development...', date: 'Nov 7, 2025' },
    { id: 2, title: 'Advanced TypeScript Tips', excerpt: 'Take your TypeScript skills to the next level...', date: 'Nov 5, 2025' },
    { id: 3, title: 'Building with Tailwind CSS', excerpt: 'Create beautiful UIs with utility-first CSS...', date: 'Nov 3, 2025' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold">My Tech Blog</h1>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="flex gap-8">
          {/* Posts */}
          <main className="flex-1 space-y-8">
            {posts.map(post => (
              <article key={post.id} className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-3">{post.title}</h2>
                <p className="text-gray-500 text-sm mb-4">{post.date}</p>
                <p className="text-gray-700 mb-4">{post.excerpt}</p>
                <a href="#" className="text-blue-600 font-semibold hover:underline">
                  Read More →
                </a>
              </article>
            ))}
          </main>

          {/* Sidebar */}
          <aside className="w-80">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">About</h3>
              <p className="text-gray-600 text-sm">
                Welcome to my blog where I share insights about web development, 
                design, and technology.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-lg mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-600 hover:underline">React</a></li>
                <li><a href="#" className="text-blue-600 hover:underline">TypeScript</a></li>
                <li><a href="#" className="text-blue-600 hover:underline">CSS</a></li>
                <li><a href="#" className="text-blue-600 hover:underline">Design</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Blog;`
  }
];

interface TemplateSelectorProps {
  onSelectTemplate: (code: string, title: string) => void;
}

const TemplateSelector = ({ onSelectTemplate }: TemplateSelectorProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
          onClick={() => onSelectTemplate(template.code, template.name)}
        >
          <div className="flex flex-col items-center text-center gap-3">
            <div className="text-primary">{template.icon}</div>
            <h3 className="font-semibold text-lg">{template.name}</h3>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TemplateSelector;