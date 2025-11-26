export type Response<T> = {
  code: number;
  currentTemplate: string;
  currentData: T;
  currentUser: UserDetail | null;
  currentOrganization: Organization;
  currentMember: {
    id: number;
    organization: Organization;
    user: User;
    muted: boolean;
    realName: unknown | null;
    permission: number;
    school: unknown | null;
    grade: unknown | null;
    phone: unknown | null;
    email: unknown | null;
  } | null;
};

export type User = {
  uid: number;
  name: string;
  isAdmin: boolean;
  level: string;
  color: string;
  profession: string;
};

export type UserDetail = User & {
  tags: string[];
  brief: string;
  verified: boolean;
};

export type Organization = {
  shortName: string;
  name: string;
  domain: string;
  type: number;
};

export type Course = {
  name: string;
  shortName: string;
  sessionName: string | null;
  smallImgUrl: string;
  brief: string;
  price: number;
  startTime: number;
  endTime: number;
};

export type CourseDetail = Course & {
  oldPrice: null;
  replayExpireTimeType: number;
  replayExpireTime: number;
  learntLessons: number;
  totalLessons: number;
  type: {
    id: number;
    shortName: string;
    name: string;
    sort: number;
  };
  difficulty: {
    id: number;
    shortName: string;
    name: string;
    sort: number;
  };
  showStatus: number;
  participants: number | null;
  requireDelivery: boolean;
  purchaseLimit: number;
  description: string;
  faq: string;
  lives: Live[];
  liveGroups: [] | Record<string, number[]>;
  hasResource: {
    qq: boolean;
    luoguTeam: boolean;
  };
  notice?: string;
  luoguTeamId?: number;
};

export type Live = {
  id: number;
  shortName: string;
  name: string;
  holder: User;
  author: User;
  shortDescription: string;
  type: string;
  startTime: number;
  endTime: number;
};

export type LiveDetail = Live & {
  description: string;
  replay: boolean;
  ongoing: boolean;
  teachingResource: {
    id: number;
    name: string;
    type: number;
  };
  cloudDiskFiles: {
    id: number;
    name: string;
    uploadTime: number;
    live: Live;
    url: string;
  }[];
};
