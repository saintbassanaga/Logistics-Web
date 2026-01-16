import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';

/**
 * HTTP method types
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * API request options
 */
interface ApiRequestOptions {
  params?: Record<string, string | number | boolean | (string | number | boolean)[]>;
  headers?: Record<string, string>;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

/**
 * ApiService - Base HTTP client service for API communication
 *
 * Features:
 * - Typed request/response handling
 * - Pagination support
 * - Request parameter building
 * - Centralized error handling via interceptors
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * Build full API URL
   */
  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseUrl}${cleanEndpoint}`;
  }

  /**
   * Build HttpParams from object
   */
  private buildParams(params?: ApiRequestOptions['params']): HttpParams {
    let httpParams = new HttpParams();

    if (!params) return httpParams;

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        value.forEach((v) => {
          httpParams = httpParams.append(key, String(v));
        });
      } else {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return httpParams;
  }

  /**
   * Build HttpHeaders from object
   */
  private buildHeaders(headers?: ApiRequestOptions['headers']): HttpHeaders {
    let httpHeaders = new HttpHeaders();

    if (!headers) return httpHeaders;

    Object.entries(headers).forEach(([key, value]) => {
      httpHeaders = httpHeaders.set(key, value);
    });

    return httpHeaders;
  }

  /**
   * GET request
   */
  get<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.get<T>(this.buildUrl(endpoint), {
      params: this.buildParams(options?.params),
      headers: this.buildHeaders(options?.headers),
    });
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, body: unknown, options?: ApiRequestOptions): Observable<T> {
    return this.http.post<T>(this.buildUrl(endpoint), body, {
      params: this.buildParams(options?.params),
      headers: this.buildHeaders(options?.headers),
    });
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, body: unknown, options?: ApiRequestOptions): Observable<T> {
    return this.http.put<T>(this.buildUrl(endpoint), body, {
      params: this.buildParams(options?.params),
      headers: this.buildHeaders(options?.headers),
    });
  }

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, body: unknown, options?: ApiRequestOptions): Observable<T> {
    return this.http.patch<T>(this.buildUrl(endpoint), body, {
      params: this.buildParams(options?.params),
      headers: this.buildHeaders(options?.headers),
    });
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.delete<T>(this.buildUrl(endpoint), {
      params: this.buildParams(options?.params),
      headers: this.buildHeaders(options?.headers),
    });
  }

  /**
   * GET paginated request
   */
  getPaginated<T>(
    endpoint: string,
    pagination?: PaginationParams,
    options?: ApiRequestOptions
  ): Observable<PaginatedResponse<T>> {
    const params: ApiRequestOptions['params'] = {
      ...options?.params,
    };

    if (pagination?.page !== undefined) {
      params['page'] = pagination.page;
    }
    if (pagination?.size !== undefined) {
      params['size'] = pagination.size;
    }
    if (pagination?.sort) {
      params['sort'] = `${pagination.sort},${pagination.direction ?? 'asc'}`;
    }

    return this.get<PaginatedResponse<T>>(endpoint, { ...options, params });
  }

  /**
   * Download file as blob
   */
  downloadFile(endpoint: string, options?: ApiRequestOptions): Observable<Blob> {
    return this.http.get(this.buildUrl(endpoint), {
      params: this.buildParams(options?.params),
      headers: this.buildHeaders(options?.headers),
      responseType: 'blob',
    });
  }

  /**
   * Upload file with FormData
   */
  uploadFile<T>(
    endpoint: string,
    file: File,
    fieldName: string = 'file',
    additionalData?: Record<string, string>
  ): Observable<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return this.http.post<T>(this.buildUrl(endpoint), formData);
  }
}
