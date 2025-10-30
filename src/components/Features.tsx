import { Code2, Sparkles, Key, Rocket, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Code2,
    title: "AI Code Generation",
    description: "Transform natural language into production-ready code instantly with advanced AI models.",
    color: "primary",
  },
  {
    icon: Key,
    title: "Your Own API Keys",
    description: "Connect your preferred AI providers - OpenAI, Anthropic, Gemini, or any other service.",
    color: "secondary",
  },
  {
    icon: Zap,
    title: "Real-Time Preview",
    description: "See your changes live as you build. What you see is exactly what you get.",
    color: "primary",
  },
  {
    icon: Rocket,
    title: "Instant Deploy",
    description: "Deploy your projects to Vercel, Netlify, or any platform with a single click.",
    color: "secondary",
  },
  {
    icon: Sparkles,
    title: "Smart Assistance",
    description: "Context-aware AI assistant helps you refactor, debug, and optimize your code.",
    color: "primary",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your API keys are encrypted and stored securely. Complete control over your data.",
    color: "secondary",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl lg:text-5xl font-bold">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Build Faster
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features that help you go from idea to production in minutes, not days.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="paper-card p-8 space-y-4 group"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-${feature.color}/10 flex items-center justify-center shadow-paper-sm group-hover:shadow-paper transition-all`}
              >
                <feature.icon className={`w-7 h-7 text-${feature.color}`} />
              </div>
              <h3 className="text-2xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
