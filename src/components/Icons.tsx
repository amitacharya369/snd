import React from 'react';
import {
  Compass,
  Building2,
  Landmark,
  Sun,
  Palette,
  Shield,
  Layers,
  Maximize2,
  Wrench,
  Train,
  Plane,
  Building,
  GraduationCap,
  Dam,
  Ticket,
  Grid,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  FileCheck,
  Award,
  Clock,
  ExternalLink,
  Search,
  Filter,
  Users,
  HardHat,
  Sparkles,
  LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Compass,
  Building2,
  Landmark,
  Sun,
  Palette,
  Shield,
  Layers,
  Maximize2,
  Wrench,
  Train,
  Plane,
  Building,
  GraduationCap,
  Dam,
  Ticket,
  Grid,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  FileCheck,
  Award,
  Clock,
  ExternalLink,
  Search,
  Filter,
  Users,
  HardHat,
  Sparkles,
};

interface DynamicIconProps {
  name: string;
  className?: string;
}

export function DynamicIcon({ name, className = 'w-5 h-5' }: DynamicIconProps) {
  const IconComponent = iconMap[name] || Shield;
  return <IconComponent className={className} />;
}
