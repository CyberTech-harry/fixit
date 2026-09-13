import React from "react";
import {
  Laptop,
  Apple,
  Smartphone,
  Globe,
  AppWindow,
  Cpu,
  Wifi,
  ShieldCheck,
  Zap,
  Sparkles,
  Terminal,
  Folder,
  Code2,
} from "lucide-react";

interface CategoryIconProps {
  name: string;
  className?: string;
}

export function CategoryIcon({ name, className = "w-5 h-5" }: CategoryIconProps) {
  switch (name?.toLowerCase()) {
    case "laptop":
    case "windows os":
    case "windows-os":
      return <Laptop className={className} />;
    case "apple":
    case "macos":
      return <Apple className={className} />;
    case "smartphone":
    case "mobile":
    case "mobile devices":
      return <Smartphone className={className} />;
    case "globe":
    case "web browsers":
    case "web-browsers":
      return <Globe className={className} />;
    case "appwindow":
    case "software & apps":
    case "software":
      return <AppWindow className={className} />;
    case "cpu":
    case "hardware & peripherals":
    case "hardware":
      return <Cpu className={className} />;
    case "wifi":
    case "networking & internet":
    case "networking":
      return <Wifi className={className} />;
    case "shieldcheck":
    case "security & privacy":
    case "security":
      return <ShieldCheck className={className} />;
    case "zap":
    case "productivity hacks":
    case "productivity":
      return <Zap className={className} />;
    case "sparkles":
    case "emerging tech & guides":
    case "emerging-tech":
      return <Sparkles className={className} />;
    case "code":
    case "code2":
    case "web development":
    case "web-development":
      return <Code2 className={className} />;
    default:
      return <Terminal className={className} />;
  }
}
