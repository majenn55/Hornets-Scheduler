import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://your-production-url.com/api';

const TOKEN_KEY = 'auth_token';

class ApiService {
  private token: string | null = null;

  async init() {
    this.token = await AsyncStorage.getItem(TOKEN_KEY);
  }

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }

  async clearToken() {
    this.token = null;
    await AsyncStorage.removeItem(TOKEN_KEY);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    return this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Teams
  async getTeams(params?: { sportType?: string; leagueId?: string }) {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/teams${query}`);
  }

  async getTeam(teamId: string) {
    return this.request<any>(`/teams/${teamId}`);
  }

  async createTeam(data: any) {
    return this.request<any>('/teams', { method: 'POST', body: JSON.stringify(data) });
  }

  // Rosters
  async getRosters(teamId: string) {
    return this.request<any>(`/rosters?teamId=${teamId}`);
  }

  async addPlayer(rosterId: string, data: any) {
    return this.request<any>(`/rosters/${rosterId}/players`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Leagues
  async getLeagues(params?: { sportType?: string }) {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/leagues${query}`);
  }

  async getLeague(leagueId: string) {
    return this.request<any>(`/leagues/${leagueId}`);
  }

  async createLeague(data: any) {
    return this.request<any>('/leagues', { method: 'POST', body: JSON.stringify(data) });
  }

  // Games
  async getGames(params?: { seasonId?: string; teamId?: string; upcoming?: string }) {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/games${query}`);
  }

  async getGame(gameId: string) {
    return this.request<any>(`/games/${gameId}`);
  }

  async updateGameScore(gameId: string, data: any) {
    return this.request<any>(`/games/${gameId}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  // Stats
  async getStats(params?: { gameId?: string; rosterPlayerId?: string }) {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/stats${query}`);
  }

  async recordStat(data: any) {
    return this.request<any>('/stats', { method: 'POST', body: JSON.stringify(data) });
  }

  // Families
  async getFamilies() {
    return this.request<any>('/families');
  }

  async createFamily(name: string) {
    return this.request<any>('/families', { method: 'POST', body: JSON.stringify({ name }) });
  }

  async inviteFamilyMember(familyId: string, email: string) {
    return this.request<any>(`/families/${familyId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Invites
  async getInvites() {
    return this.request<any>('/invites');
  }

  async sendInvite(data: any) {
    return this.request<any>('/invites', { method: 'POST', body: JSON.stringify(data) });
  }

  async acceptInvite(inviteId: string) {
    return this.request<any>(`/invites/${inviteId}/accept`, { method: 'POST' });
  }

  // Media
  async getMedia(params?: { teamId?: string; gameId?: string; type?: string }) {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/media${query}`);
  }

  async uploadMedia(formData: FormData) {
    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    const response = await fetch(`${API_BASE_URL}/media`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return response.json();
  }

  // Streams
  async getStreams(params?: { gameId?: string; live?: string }) {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request<any>(`/streams${query}`);
  }

  async createStream(data: { gameId: string; title: string }) {
    return this.request<any>('/streams', { method: 'POST', body: JSON.stringify(data) });
  }

  // Notifications
  async getNotifications(unread?: boolean) {
    const query = unread ? '?unread=true' : '';
    return this.request<any>(`/notifications${query}`);
  }

  async markNotificationsRead(ids?: string[]) {
    return this.request<any>('/notifications', {
      method: 'PATCH',
      body: JSON.stringify({ ids }),
    });
  }
}

export const api = new ApiService();
