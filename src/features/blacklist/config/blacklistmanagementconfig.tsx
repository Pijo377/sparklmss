import {
    Fingerprint, Mail, Globe, Smartphone, Phone, User,
    Landmark, Route, Hash, Link
} from "lucide-react";
import React from "react";

// ── Types ──────────────────────────────────────────────────────────────
export interface BlacklistEntry {
    id: number;
    value: string;
    date: string;
    firstName?: string;
    lastName?: string;
}

export interface DeviceEntry {
    id: number;
    customerId: string;
    browser: string;
    browserVersion: string;
    operatingSystem: string;
    osVersion: string;
    deviceType: string;
    ipAddress: string;
}

export interface Category {
    name: string;
    icon: React.ReactNode;
}

// Placeholder map per category
export const categoryPlaceholder: Record<string, string> = {
    "Blacklist SSN": "000-00-0000",
    "Blacklist Email": "user@example.com",
    "Blacklist Phone No": "(000)-000-0000",
    "Blacklist Employer": "Company Inc.",
    "Blacklist Account No": "1234567890",
    "Blacklist ABA": "123456789",
    "Blacklist IPAddress": "192.168.1.1",
    "Blacklist Domain": "example.com",
};

// ── Static Data ────────────────────────────────────────────────────────
export const categories: Category[] = [
    { name: "Blacklist SSN", icon: React.createElement(Fingerprint, { size: 16 }) },
    { name: "Blacklist Email", icon: React.createElement(Mail, { size: 16 }) },
    { name: "Blacklist Phone No", icon: React.createElement(Phone, { size: 16 }) },
    { name: "Blacklist Customer", icon: React.createElement(User, { size: 16 }) },
    { name: "Blacklist Employer", icon: React.createElement(Landmark, { size: 16 }) },
    { name: "Blacklist Account No", icon: React.createElement(Hash, { size: 16 }) },
    { name: "Blacklist ABA", icon: React.createElement(Route, { size: 16 }) },
    { name: "Blacklist Subaffiliate ID", icon: React.createElement(Link, { size: 16 }) },
    { name: "Blacklist IPAddress", icon: React.createElement(Globe, { size: 16 }) },
    { name: "Blacklist Domain", icon: React.createElement(Globe, { size: 16 }) },
    { name: "Blacklist Device", icon: React.createElement(Smartphone, { size: 16 }) },
];

export const initialData: BlacklistEntry[] = [
    { id: 1, value: "416-49-8908", date: "Oct 12, 2023" },
    { id: 2, value: "466-49-8908", date: "Oct 14, 2023" },
    { id: 3, value: "654-18-7459", date: "Nov 02, 2023" },
    { id: 4, value: "748-24-5253", date: "Nov 15, 2023" },
    { id: 5, value: "510-12-3212", date: "Dec 01, 2023" },
    { id: 6, value: "123-45-6789", date: "Dec 05, 2023" },
    { id: 7, value: "987-65-4321", date: "Dec 10, 2023" },
];

export const initialCustomerData: BlacklistEntry[] = [
    { id: 1, firstName: "John", lastName: "Doe", value: "John Doe", date: "Oct 12, 2023" },
    { id: 2, firstName: "Jane", lastName: "Smith", value: "Jane Smith", date: "Oct 14, 2023" },
    { id: 3, firstName: "Robert", lastName: "Johnson", value: "Robert Johnson", date: "Nov 02, 2023" },
    { id: 4, firstName: "Emily", lastName: "Davis", value: "Emily Davis", date: "Nov 15, 2023" },
    { id: 5, firstName: "Michael", lastName: "Wilson", value: "Michael Wilson", date: "Dec 01, 2023" },
    { id: 6, firstName: "Sarah", lastName: "Brown", value: "Sarah Brown", date: "Dec 05, 2023" },
    { id: 7, firstName: "David", lastName: "Jones", value: "David Jones", date: "Dec 10, 2023" },
    { id: 8, firstName: "Lisa", lastName: "Garcia", value: "Lisa Garcia", date: "Dec 12, 2023" },
    { id: 9, firstName: "James", lastName: "Miller", value: "James Miller", date: "Dec 15, 2023" },
    { id: 10, firstName: "Emma", lastName: "Martinez", value: "Emma Martinez", date: "Dec 18, 2023" },
];

export const initialEmailData: BlacklistEntry[] = [
    { id: 1, value: "john.doe@example.com", date: "Oct 12, 2023" },
    { id: 2, value: "jane.smith@gmail.com", date: "Oct 14, 2023" },
    { id: 3, value: "robert.j@outlook.com", date: "Nov 02, 2023" },
    { id: 4, value: "emily.d@yahoo.com", date: "Nov 15, 2023" },
    { id: 5, value: "michael.w@protonmail.com", date: "Dec 01, 2023" },
    { id: 6, value: "sarah.b@company.com", date: "Dec 05, 2023" },
    { id: 7, value: "david.j@tech.org", date: "Dec 10, 2023" },
    { id: 8, value: "lisa.g@webmail.net", date: "Dec 12, 2023" },
    { id: 9, value: "james.m@startup.io", date: "Dec 15, 2023" },
    { id: 10, value: "emma.m@service.com", date: "Dec 18, 2023" },
];

export const initialPhoneData: BlacklistEntry[] = [
    { id: 1, value: "(555) 123-4567", date: "Oct 12, 2023" },
    { id: 2, value: "(555) 234-5678", date: "Oct 14, 2023" },
    { id: 3, value: "(555) 345-6789", date: "Nov 02, 2023" },
    { id: 4, value: "(555) 456-7890", date: "Nov 15, 2023" },
    { id: 5, value: "(555) 567-8901", date: "Dec 01, 2023" },
    { id: 6, value: "(555) 678-9012", date: "Dec 05, 2023" },
    { id: 7, value: "(555) 789-0123", date: "Dec 10, 2023" },
    { id: 8, value: "(555) 890-1234", date: "Dec 12, 2023" },
    { id: 9, value: "(555) 901-2345", date: "Dec 15, 2023" },
    { id: 10, value: "(555) 012-3456", date: "Dec 18, 2023" },
];

export const initialAccountData: BlacklistEntry[] = [
    { id: 1, value: "1234567890", date: "Oct 12, 2023" },
    { id: 2, value: "2345678901", date: "Oct 14, 2023" },
    { id: 3, value: "3456789012", date: "Nov 02, 2023" },
    { id: 4, value: "4567890123", date: "Nov 15, 2023" },
    { id: 5, value: "5678901234", date: "Dec 01, 2023" },
    { id: 6, value: "6789012345", date: "Dec 05, 2023" },
    { id: 7, value: "7890123456", date: "Dec 10, 2023" },
    { id: 8, value: "8901234567", date: "Dec 12, 2023" },
    { id: 9, value: "9012345678", date: "Dec 15, 2023" },
    { id: 10, value: "0123456789", date: "Dec 18, 2023" },
];

export const initialEmployerData: BlacklistEntry[] = [
    { id: 1, value: "Acme Corp", date: "Oct 12, 2023" },
    { id: 2, value: "Globex Corporation", date: "Oct 14, 2023" },
    { id: 3, value: "Soylent Corp", date: "Nov 02, 2023" },
    { id: 4, value: "Initech", date: "Nov 15, 2023" },
    { id: 5, value: "Umbrella Corp", date: "Dec 01, 2023" },
    { id: 6, value: "Massive Dynamic", date: "Dec 05, 2023" },
    { id: 7, value: "Hooli", date: "Dec 10, 2023" },
    { id: 8, value: "Pied Piper", date: "Dec 12, 2023" },
    { id: 9, value: "Cyberdyne Systems", date: "Dec 15, 2023" },
    { id: 10, value: "Wayne Enterprises", date: "Dec 18, 2023" },
];

export const initialAbaData: BlacklistEntry[] = [
    { id: 1, value: "123456789", date: "Oct 12, 2023" },
    { id: 2, value: "987654321", date: "Oct 14, 2023" },
    { id: 3, value: "456789123", date: "Nov 02, 2023" },
    { id: 4, value: "321654987", date: "Nov 15, 2023" },
    { id: 5, value: "789123456", date: "Dec 01, 2023" },
    { id: 6, value: "654987321", date: "Dec 05, 2023" },
    { id: 7, value: "147258369", date: "Dec 10, 2023" },
    { id: 8, value: "369258147", date: "Dec 12, 2023" },
    { id: 9, value: "258369147", date: "Dec 15, 2023" },
    { id: 10, value: "741852963", date: "Dec 18, 2023" },
];

export const initialIpData: BlacklistEntry[] = [
    { id: 1, value: "145.254.245.26", date: "Oct 12, 2023" },
    { id: 2, value: "192.168.1.1", date: "Oct 14, 2023" },
    { id: 3, value: "10.0.0.1", date: "Nov 02, 2023" },
    { id: 4, value: "172.16.0.1", date: "Nov 15, 2023" },
    { id: 5, value: "8.8.8.8", date: "Dec 01, 2023" },
    { id: 6, value: "1.1.1.1", date: "Dec 05, 2023" },
    { id: 7, value: "208.67.222.222", date: "Dec 10, 2023" },
    { id: 8, value: "9.9.9.9", date: "Dec 12, 2023" },
    { id: 9, value: "185.199.108.153", date: "Dec 15, 2023" },
    { id: 10, value: "203.0.113.45", date: "Dec 18, 2023" },
];

export const initialDomainData: BlacklistEntry[] = [
    { id: 1, value: "example.com", date: "Oct 12, 2023" },
    { id: 2, value: "test.org", date: "Oct 14, 2023" },
    { id: 3, value: "spamdomain.net", date: "Nov 02, 2023" },
    { id: 4, value: "badsite.info", date: "Nov 15, 2023" },
    { id: 5, value: "malware.biz", date: "Dec 01, 2023" },
    { id: 6, value: "phish.me", date: "Dec 05, 2023" },
    { id: 7, value: "untrusted.co", date: "Dec 10, 2023" },
    { id: 8, value: "shady-link.xyz", date: "Dec 12, 2023" },
    { id: 9, value: "risky-deal.top", date: "Dec 15, 2023" },
    { id: 10, value: "fake-bank.site", date: "Dec 18, 2023" },
];

export const initialDeviceData: DeviceEntry[] = [
    {
        id: 1, customerId: "960", browser: "Chrome", browserVersion: "106.0.0.0",
        operatingSystem: "Windows", osVersion: "windows-10", deviceType: "Desktop", ipAddress: "59.92.51.184",
    },
    {
        id: 2, customerId: "1024", browser: "Firefox", browserVersion: "115.0",
        operatingSystem: "MacOS", osVersion: "macos-13", deviceType: "Desktop", ipAddress: "103.21.58.90",
    },
    {
        id: 3, customerId: "1150", browser: "Safari", browserVersion: "16.4",
        operatingSystem: "iOS", osVersion: "ios-16", deviceType: "Mobile", ipAddress: "49.36.120.72",
    },
];

// Mock options for Subaffiliate selects
export const campaignOptions = ["Campaign Alpha", "Campaign Beta", "Campaign Gamma", "Campaign Delta"];
export const affiliateOptions = ["AFF-001", "AFF-002", "AFF-003", "AFF-004"];
export const subaffiliateOptions = ["SUB-101", "SUB-102", "SUB-201", "SUB-301"];

// Mapping for descriptive labels in the right panel
export const categoryLabels: Record<string, string> = {
    "Blacklist SSN": "Enter the SSN to be blacklisted",
    "Blacklist Email": "Enter the E-Mail to be blacklisted",
    "Blacklist Phone No": "Enter the phone number to be blacklisted",
    "Blacklist Employer": "Enter the Employer to be blacklisted",
    "Blacklist Account No": "Enter the account number to be blacklisted",
    "Blacklist ABA": "Enter ABA number to be blacklisted",
    "Blacklist IPAddress": "Enter the IP Address to be blacklisted",
    "Blacklist Domain": "Enter the Domain to be blacklisted"
};

// Mapping for placeholders in the right panel
export const categoryPlaceholders: Record<string, string> = {
    "Blacklist SSN": "000-00-0000",
    "Blacklist Email": "email@example.com",
    "Blacklist Phone No": "(000) 000-0000",
    "Blacklist Employer": "Enter Employer name",
    "Blacklist Account No": "Enter account number",
    "Blacklist ABA": "Enter ABA number",
    "Blacklist IPAddress": "0.0.0.0",
    "Blacklist Domain": "example.com"
};
