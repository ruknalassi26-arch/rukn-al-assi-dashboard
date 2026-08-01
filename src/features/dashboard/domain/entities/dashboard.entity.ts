// ==============================================================================
// features/dashboard/domain/entities/dashboard.entity.ts
// Domain Entity Classes for Dashboard
// ==============================================================================

export interface DashboardStatsProps {
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  totalServices: number;
  activeServices: number;
  totalProjects: number;
  completedProjects: number;
  totalRfqs: number;
  pendingRfqs: number;
  totalContacts: number;
  unreadContacts: number;
  totalCertificates: number;
  totalTeamMembers: number;
  totalClients: number;
  totalCompanyStats: number;
}

export class DashboardStatsEntity {
  public readonly totalProducts: number;
  public readonly activeProducts: number;
  public readonly totalCategories: number;
  public readonly totalServices: number;
  public readonly activeServices: number;
  public readonly totalProjects: number;
  public readonly completedProjects: number;
  public readonly totalRfqs: number;
  public readonly pendingRfqs: number;
  public readonly totalContacts: number;
  public readonly unreadContacts: number;
  public readonly totalCertificates: number;
  public readonly totalTeamMembers: number;
  public readonly totalClients: number;
  public readonly totalCompanyStats: number;

  constructor(props: DashboardStatsProps) {
    this.totalProducts = props.totalProducts;
    this.activeProducts = props.activeProducts;
    this.totalCategories = props.totalCategories;
    this.totalServices = props.totalServices;
    this.activeServices = props.activeServices;
    this.totalProjects = props.totalProjects;
    this.completedProjects = props.completedProjects;
    this.totalRfqs = props.totalRfqs;
    this.pendingRfqs = props.pendingRfqs;
    this.totalContacts = props.totalContacts;
    this.unreadContacts = props.unreadContacts;
    this.totalCertificates = props.totalCertificates;
    this.totalTeamMembers = props.totalTeamMembers;
    this.totalClients = props.totalClients;
    this.totalCompanyStats = props.totalCompanyStats;
  }

  public get pendingInquiriesCount(): number {
    return this.pendingRfqs + this.unreadContacts;
  }
}

export interface ChartPoint {
  month: string;
  count: number;
}

export class DashboardChartsEntity {
  public readonly rfqTrend: ChartPoint[];
  public readonly contactTrend: ChartPoint[];

  constructor(props: { rfqTrend: ChartPoint[]; contactTrend: ChartPoint[] }) {
    this.rfqTrend = props.rfqTrend;
    this.contactTrend = props.contactTrend;
  }
}

export class ActivityLogEntity {
  public readonly id: string;
  public readonly action: string;
  public readonly entityType: string;
  public readonly entityTitle: string | null;
  public readonly userId: string | null;
  public readonly userEmail: string | null;
  public readonly metadata: Record<string, unknown> | null;
  public readonly createdAt: Date;

  constructor(props: {
    id: string;
    action: string;
    entityType: string;
    entityTitle: string | null;
    userId: string | null;
    userEmail: string | null;
    metadata: Record<string, unknown> | null;
    createdAt: Date;
  }) {
    this.id = props.id;
    this.action = props.action;
    this.entityType = props.entityType;
    this.entityTitle = props.entityTitle;
    this.userId = props.userId;
    this.userEmail = props.userEmail;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
  }
}

export class LatestRfqEntity {
  public readonly id: string;
  public readonly fullName: string;
  public readonly companyName: string | null;
  public readonly email: string;
  public readonly status: string;
  public readonly createdAt: Date;

  constructor(props: {
    id: string;
    fullName: string;
    companyName: string | null;
    email: string;
    status: string;
    createdAt: Date;
  }) {
    this.id = props.id;
    this.fullName = props.fullName;
    this.companyName = props.companyName;
    this.email = props.email;
    this.status = props.status;
    this.createdAt = props.createdAt;
  }
}

export class LatestContactEntity {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly subject: string | null;
  public readonly status: string;
  public readonly createdAt: Date;

  constructor(props: {
    id: string;
    name: string;
    email: string;
    subject: string | null;
    status: string;
    createdAt: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.subject = props.subject;
    this.status = props.status;
    this.createdAt = props.createdAt;
  }
}

export type DashboardStats = DashboardStatsEntity;
export type DashboardCharts = DashboardChartsEntity;
export type MonthlyChartData = ChartPoint;

