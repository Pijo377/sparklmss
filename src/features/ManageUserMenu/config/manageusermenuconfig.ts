import {
    LayoutDashboard, Users, Target, UserCircle, PhoneCall, Settings,
    ArrowRightLeft, BarChart3, Link as LinkIcon, ShieldCheck, UserCog,
    LayoutGrid, Activity, Heart, CheckCircle, Banknote, CloudDownload, CloudUpload,
    Briefcase, Package, Megaphone, Map, Ban, Locate, Calculator,
    Menu, Key, Folder, Mail, MessageSquare, FileText,
    Building2, Zap, Sliders, Server, Link, Gift,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────────
export interface MenuItem {
    id: string;
    label: string;
    icon: any;
    subMenus?: MenuItem[];
}

export interface TabConfig {
    value: string;
    label: string;
    icon: any;
}

// ─── Shared Mock Data ──────────────────────────────────────────────────────────
export const ROLES = [
    'Admin',
    'Manager',
    'Supervisor',
    'Agent',
    'Collection Agent'
];

export const MENU_ITEMS: MenuItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        subMenus: [
            { id: 'dashboard-tab', label: 'Dashboard', icon: LayoutGrid },
            { id: 'activity', label: 'Activity', icon: Activity },
            { id: 'vitals', label: 'Vitals', icon: Heart },
        ]
    },
    { id: 'customers', label: 'Customers', icon: Users },
    {
        id: 'leads', label: 'Manage Leads', icon: Target,
        subMenus: [
            { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
            { id: 'product', label: 'Product', icon: Package },
            { id: 'campaign', label: 'Campaign', icon: Megaphone },
            { id: 'campaign-config', label: 'Campaign Config', icon: Settings },
            { id: 'rebate', label: 'Rebate', icon: Gift },
            { id: 'mapping', label: 'Portfolio Mapping', icon: Map },
            { id: 'blacklist', label: 'Blacklist Management', icon: Ban },
            { id: 'lead', label: 'Lead', icon: Locate },
            { id: 'scoring', label: 'Scoring Cost', icon: Calculator },
        ]
    },
    {
        id: 'profile', label: 'Profile Management', icon: UserCircle,
        subMenus: [
            { id: 'user-profile', label: 'Manage User Profile', icon: UserCircle },
            { id: 'user-menu', label: 'Manage User Menu', icon: Menu },
            { id: 'password', label: 'Change Password', icon: Key },
        ]
    },
    { id: 'callcenter', label: 'Call Center', icon: PhoneCall },
    {
        id: 'configuration', label: 'Configuration', icon: Settings,
        subMenus: [
            { id: 'documents', label: 'Documents', icon: Folder },
            { id: 'email', label: 'Email', icon: Mail },
            { id: 'sms', label: 'SMS', icon: MessageSquare },
            { id: 'ach-file', label: 'ACH File', icon: FileText },
            { id: 'ach-provider', label: 'ACH Provider', icon: Building2 },
            { id: 'bureau', label: 'Bureau', icon: Server },
            { id: 'auto-origination', label: 'Auto Origination', icon: Zap },
            { id: 'underwriting', label: 'Underwriting', icon: CheckCircle },
            { id: 'general', label: 'General', icon: Sliders },
            { id: 'quick-links', label: 'Quick Links', icon: Link },
        ]
    },
    {
        id: 'transaction', label: 'Transaction', icon: ArrowRightLeft,
        subMenus: [
            { id: 'approve', label: 'Approve Loans', icon: CheckCircle },
            { id: 'credits', label: 'Pending Credits', icon: Banknote },
            { id: 'debits', label: 'Pending Debits', icon: Banknote },
            { id: 'create-ach', label: 'Create ACH File', icon: CloudDownload },
            { id: 'return-file', label: 'Return File Processing', icon: CloudUpload },
        ]
    },
    { id: 'reporting', label: 'Reporting', icon: BarChart3 },
    { id: 'quicklink', label: 'Quick Link', icon: LinkIcon },
];

export const USERS = [
    { id: '1', name: 'John Doe', role: 'Admin', email: 'john.doe@example.com' },
    { id: '2', name: 'Jane Smith', role: 'Manager', email: 'jane.smith@example.com' },
    { id: '3', name: 'Mike Johnson', role: 'Agent', email: 'mike.j@example.com' },
    { id: '4', name: 'Sarah Wilson', role: 'Supervisor', email: 'sarah.w@example.com' },
    { id: '5', name: 'Robert Brown', role: 'Collection Agent', email: 'robert.b@example.com' },
    { id: '6', name: 'Emily Davis', role: 'Agent', email: 'emily.d@example.com' },
    { id: '7', name: 'Michael Lee', role: 'Manager', email: 'michael.l@example.com' },
    { id: '8', name: 'Jessica Taylor', role: 'Supervisor', email: 'jessica.t@example.com' },
    { id: '9', name: 'William Clark', role: 'Agent', email: 'william.c@example.com' },
    { id: '10', name: 'Linda Martinez', role: 'Manager', email: 'linda.m@example.com' },
];

export const tabConfigs: TabConfig[] = [
    {
        value: "role-config",
        label: "Role Menu Configuration",
        icon: UserCog,
    },
    {
        value: "user-config",
        label: "User Menu Configuration",
        icon: ShieldCheck,
    },
];
