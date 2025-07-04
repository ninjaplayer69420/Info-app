"use client"

import React from "react"
import {
  Gift,
  Check,
  Star,
  Download,
  Play,
  Heart,
  Zap,
  Shield,
  Crown,
  Sparkles,
  Trophy,
  Target,
  Rocket,
  FlameIcon as Fire,
  Diamond,
  Gem,
  Award,
  Medal,
  Flag,
  Lock,
  Unlock,
  Eye,
  Clock,
  Calendar,
  Mail,
  Phone,
  Globe,
  User,
  Users,
  Settings,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Link,
  Copy,
  Share,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Search,
  Filter,
  ListOrderedIcon as Sort,
  Grid,
  List,
  Image,
  Video,
  Music,
  FileText,
  Folder,
  Save,
  Edit,
  Trash,
  RefreshCw,
  Power,
  Wifi,
  Battery,
  Volume2,
  Camera,
  Mic,
  MapPin,
  Navigation,
  Compass,
  Home,
  Building,
  Car,
  Plane,
  Ship,
  Train,
  Bike,
  Coffee,
  Pizza,
  ShoppingCart,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  Activity,
  Cpu,
  HardDrive,
  Smartphone,
  Laptop,
  Monitor,
  Printer,
  Headphones,
  Gamepad2,
  Book,
  BookOpen,
  GraduationCap,
  Briefcase,
  PenToolIcon as Tool,
  Wrench,
  Hammer,
  Scissors,
  Paintbrush,
  Palette,
  Brush,
  Pen,
  Pencil,
  Eraser,
  Ruler,
  Calculator,
  Lightbulb,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Snowflake,
  Umbrella,
  TreePine,
  Flower,
  Leaf,
  Bug,
  Fish,
  Bird,
  Cat,
  Dog,
  Rabbit,
  BeakerIcon as Bear,
  LassoIcon as Lion,
  EraserIcon as Elephant,
  Turtle,
  FlowerIcon as Butterfly,
  BeakerIcon as Bee,
  BugIcon as Spider,
  AntennaIcon as Ant,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Icon mapping
const iconMap = {
  // Basic icons
  gift: Gift,
  check: Check,
  "check-green": CheckCircle,
  "check-circle": CheckCircle,
  star: Star,
  download: Download,
  play: Play,
  heart: Heart,
  zap: Zap,
  shield: Shield,
  crown: Crown,
  sparkles: Sparkles,
  trophy: Trophy,
  target: Target,
  rocket: Rocket,
  fire: Fire,
  diamond: Diamond,
  gem: Gem,
  award: Award,
  medal: Medal,
  flag: Flag,

  // Security & Access
  lock: Lock,
  unlock: Unlock,
  eye: Eye,

  // Time & Calendar
  clock: Clock,
  calendar: Calendar,

  // Communication
  mail: Mail,
  phone: Phone,
  globe: Globe,
  message: MessageCircle,
  send: Send,

  // Users
  user: User,
  users: Users,

  // Interface
  settings: Settings,
  info: Info,
  alert: AlertCircle,
  "alert-circle": AlertCircle,
  "x-circle": XCircle,
  plus: Plus,
  minus: Minus,

  // Arrows
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,
  "arrow-up": ArrowUp,
  "arrow-down": ArrowDown,

  // Links & Sharing
  "external-link": ExternalLink,
  link: Link,
  copy: Copy,
  share: Share,
  bookmark: Bookmark,

  // Social
  "thumbs-up": ThumbsUp,
  "thumbs-down": ThumbsDown,

  // Search & Filter
  search: Search,
  filter: Filter,
  sort: Sort,
  grid: Grid,
  list: List,

  // Media
  image: Image,
  video: Video,
  music: Music,
  camera: Camera,
  mic: Mic,

  // Files
  "file-text": FileText,
  file: FileText,
  folder: Folder,
  save: Save,
  edit: Edit,
  trash: Trash,

  // System
  refresh: RefreshCw,
  power: Power,
  wifi: Wifi,
  battery: Battery,
  volume: Volume2,

  // Location
  "map-pin": MapPin,
  navigation: Navigation,
  compass: Compass,

  // Buildings & Transport
  home: Home,
  building: Building,
  car: Car,
  plane: Plane,
  ship: Ship,
  train: Train,
  bike: Bike,

  // Food & Shopping
  coffee: Coffee,
  pizza: Pizza,
  "shopping-cart": ShoppingCart,
  cart: ShoppingCart,

  // Finance
  "credit-card": CreditCard,
  card: CreditCard,
  dollar: DollarSign,
  money: DollarSign,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  "bar-chart": BarChart,
  "pie-chart": PieChart,
  activity: Activity,

  // Technology
  cpu: Cpu,
  "hard-drive": HardDrive,
  smartphone: Smartphone,
  laptop: Laptop,
  monitor: Monitor,
  printer: Printer,
  headphones: Headphones,
  gamepad: Gamepad2,

  // Education & Work
  book: Book,
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
  briefcase: Briefcase,

  // Tools
  tool: Tool,
  wrench: Wrench,
  hammer: Hammer,
  scissors: Scissors,

  // Art & Design
  paintbrush: Paintbrush,
  palette: Palette,
  brush: Brush,
  pen: Pen,
  pencil: Pencil,
  eraser: Eraser,
  ruler: Ruler,
  calculator: Calculator,

  // Light & Weather
  lightbulb: Lightbulb,
  bulb: Lightbulb,
  sun: Sun,
  moon: Moon,
  cloud: Cloud,
  "cloud-rain": CloudRain,
  rain: CloudRain,
  snowflake: Snowflake,
  snow: Snowflake,
  umbrella: Umbrella,

  // Nature
  tree: TreePine,
  flower: Flower,
  leaf: Leaf,

  // Animals
  bug: Bug,
  fish: Fish,
  bird: Bird,
  cat: Cat,
  dog: Dog,
  rabbit: Rabbit,
  bear: Bear,
  lion: Lion,
  elephant: Elephant,
  turtle: Turtle,
  butterfly: Butterfly,
  bee: Bee,
  spider: Spider,
  ant: Ant,
}

// Button color schemes
const buttonColors = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-600 hover:bg-gray-700 text-white",
  success: "bg-green-600 hover:bg-green-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  warning: "bg-yellow-600 hover:bg-yellow-700 text-white",
  info: "bg-cyan-600 hover:bg-cyan-700 text-white",
  light: "bg-gray-100 hover:bg-gray-200 text-gray-900",
  dark: "bg-gray-900 hover:bg-gray-800 text-white",
  gradient: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white",
  "gradient-green": "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white",
  "gradient-orange": "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white",
  "gradient-purple": "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white",
  outline: "border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50",
  "outline-primary": "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
  "outline-success": "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white",
  "outline-danger": "border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white",
}

// Button sizes
const buttonSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
  xl: "px-8 py-4 text-xl",
}

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const parseContent = (text: string) => {
    const lines = text.split("\n")
    const elements: React.ReactNode[] = []
    let currentIndex = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmedLine = line.trim()

      // Skip empty lines
      if (!trimmedLine) {
        elements.push(<br key={`br-${currentIndex++}`} />)
        continue
      }

      // Headings (H1-H8)
      const headingMatch = trimmedLine.match(/^(#{1,8})\s+(.+)$/)
      if (headingMatch) {
        const level = headingMatch[1].length
        const text = headingMatch[2]
        const HeadingTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements
        const sizeClasses = {
          1: "text-4xl font-bold mb-6 text-white glow-text",
          2: "text-3xl font-bold mb-5 text-white",
          3: "text-2xl font-semibold mb-4 text-white",
          4: "text-xl font-semibold mb-3 text-white",
          5: "text-lg font-medium mb-3 text-white",
          6: "text-base font-medium mb-2 text-white",
          7: "text-sm font-medium mb-2 text-gray-300",
          8: "text-xs font-medium mb-2 text-gray-400",
        }

        elements.push(
          React.createElement(
            HeadingTag,
            {
              key: `heading-${currentIndex++}`,
              className: sizeClasses[level as keyof typeof sizeClasses] || sizeClasses[6],
            },
            parseInlineContent(text),
          ),
        )
        continue
      }

      // Subtext (starts with >)
      if (trimmedLine.startsWith(">")) {
        const text = trimmedLine.substring(1).trim()
        elements.push(
          <p key={`subtext-${currentIndex++}`} className="text-gray-400 italic mb-4 pl-4 border-l-2 border-gray-600">
            {parseInlineContent(text)}
          </p>,
        )
        continue
      }

      // Bullet points
      if (trimmedLine.startsWith("•") || trimmedLine.startsWith("-") || trimmedLine.startsWith("*")) {
        const text = trimmedLine.substring(1).trim()
        elements.push(
          <div key={`bullet-${currentIndex++}`} className="flex items-start space-x-3 mb-3">
            <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-gray-300 leading-relaxed">{parseInlineContent(text)}</p>
          </div>,
        )
        continue
      }

      // Regular paragraph
      elements.push(
        <p key={`p-${currentIndex++}`} className="text-gray-300 mb-4 leading-relaxed text-lg">
          {parseInlineContent(trimmedLine)}
        </p>,
      )
    }

    return elements
  }

  const parseInlineContent = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = []
    let currentIndex = 0
    let remaining = text

    while (remaining.length > 0) {
      // Icon syntax: {icon:name} or {icon:name,color=green,size=5}
      const iconMatch = remaining.match(/\{icon:([^}]+)\}/)
      if (iconMatch) {
        const beforeIcon = remaining.substring(0, iconMatch.index)
        if (beforeIcon) {
          parts.push(parseTextFormatting(beforeIcon, currentIndex++))
        }

        const iconParams = iconMatch[1].split(",")
        const iconName = iconParams[0].trim()
        const iconProps: any = { className: "inline w-5 h-5 mx-1" }

        // Parse additional parameters
        for (let i = 1; i < iconParams.length; i++) {
          const param = iconParams[i].trim()
          if (param.startsWith("color=")) {
            const color = param.split("=")[1]
            iconProps.className += ` text-${color}-400`
          } else if (param.startsWith("size=")) {
            const size = param.split("=")[1]
            iconProps.className = iconProps.className.replace("w-5 h-5", `w-${size} h-${size}`)
          }
        }

        const IconComponent = iconMap[iconName as keyof typeof iconMap]
        if (IconComponent) {
          parts.push(<IconComponent key={`icon-${currentIndex++}`} {...iconProps} />)
        } else {
          parts.push(
            <span key={`icon-missing-${currentIndex++}`} className="text-red-400">
              ❓
            </span>,
          )
        }

        remaining = remaining.substring(iconMatch.index! + iconMatch[0].length)
        continue
      }

      // Button syntax: {button:text=Click Me,type=primary,color=green,link=https://example.com,icon=download,size=lg,target=_blank}
      const buttonMatch = remaining.match(/\{button:([^}]+)\}/)
      if (buttonMatch) {
        const beforeButton = remaining.substring(0, buttonMatch.index)
        if (beforeButton) {
          parts.push(parseTextFormatting(beforeButton, currentIndex++))
        }

        const buttonParams = buttonMatch[1].split(",")
        const buttonProps: any = {
          text: "Button",
          type: "primary",
          color: "primary",
          size: "md",
          target: "_self",
        }

        // Parse button parameters
        buttonParams.forEach((param) => {
          const [key, value] = param.split("=").map((s) => s.trim())
          if (key && value) {
            buttonProps[key] = value
          }
        })

        const buttonColorClass = buttonColors[buttonProps.color as keyof typeof buttonColors] || buttonColors.primary
        const buttonSizeClass = buttonSizes[buttonProps.size as keyof typeof buttonSizes] || buttonSizes.md
        const IconComponent = buttonProps.icon ? iconMap[buttonProps.icon as keyof typeof iconMap] : null

        const buttonElement = (
          <Button
            key={`button-${currentIndex++}`}
            className={`${buttonColorClass} ${buttonSizeClass} mx-2 my-1 inline-flex items-center gap-2`}
            onClick={() => {
              if (buttonProps.link) {
                if (buttonProps.target === "_blank") {
                  window.open(buttonProps.link, "_blank")
                } else {
                  window.location.href = buttonProps.link
                }
              }
            }}
          >
            {IconComponent && <IconComponent className="w-4 h-4" />}
            {buttonProps.text}
          </Button>
        )

        parts.push(buttonElement)
        remaining = remaining.substring(buttonMatch.index! + buttonMatch[0].length)
        continue
      }

      // No more special syntax found, add the rest as formatted text
      parts.push(parseTextFormatting(remaining, currentIndex++))
      break
    }

    return parts
  }

  const parseTextFormatting = (text: string, key: number): React.ReactNode => {
    // Bold: **text** or __text__
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    text = text.replace(/__(.*?)__/g, "<strong>$1</strong>")

    // Italic: *text* or _text_
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>")
    text = text.replace(/_(.*?)_/g, "<em>$1</em>")

    // Code: `text`
    text = text.replace(
      /`(.*?)`/g,
      '<code class="bg-gray-800 px-2 py-1 rounded text-sm font-mono text-green-400">$1</code>',
    )

    // Links: [text](url)
    text = text.replace(
      /\[([^\]]+)\]$$([^)]+)$$/g,
      '<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>',
    )

    return <span key={key} dangerouslySetInnerHTML={{ __html: text }} />
  }

  return <div className={`prose prose-invert max-w-none ${className}`}>{parseContent(content)}</div>
}
