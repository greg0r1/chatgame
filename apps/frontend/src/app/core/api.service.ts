import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type RoundStatus = 'running' | 'won' | 'lost' | 'aborted';

export interface RoundEntity {
  id: string;
  userId: string;
  level: number;
  contactId: string;
  multiplicator: number;
  turns: number;
  status: RoundStatus;
  startedAt: string;
  finishedAt: string | null;
}

export interface StartRoundDto {
  level: number;
  contactId: string;
}

export interface RevealResponse {
  roundId: string;
  newMultiplicator: number;
  turns: number;
  message: string | null;
}

export interface GuessDto {
  correct: boolean;
}

export interface GuessResponse {
  round: RoundEntity;
  delta: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl ?? 'http://localhost:3000';
  private readonly json = new HttpHeaders({ 'Content-Type': 'application/json' });

  start(dto: StartRoundDto): Observable<RoundEntity> {
    return this.http.post<RoundEntity>(`${this.baseUrl}/v1/rounds/start`, dto, {
      headers: this.json,
    });
  }

  reveal(roundId: string): Observable<RevealResponse> {
    return this.http.post<RevealResponse>(
      `${this.baseUrl}/v1/rounds/${roundId}/reveal`,
      {},
      { headers: this.json }
    );
  }

  guess(roundId: string, dto: GuessDto): Observable<GuessResponse> {
    return this.http.post<GuessResponse>(`${this.baseUrl}/v1/rounds/${roundId}/guess`, dto, {
      headers: this.json,
    });
  }
}
