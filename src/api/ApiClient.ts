/**
 * ============================================================
 * API CLIENT - REST API Testing Utility
 * ============================================================
 *
 * 📚 LEARNING NOTES:
 * Playwright's APIRequestContext allows testing REST APIs
 * without a browser. Key benefits:
 * 1. Faster than browser-based API calls
 * 2. Can validate API independently from UI
 * 3. See up test data via API before UI tests
 * 4. Verify backend state after UI actions
 *
 * 🏗️ OOP CONCEPTS:
 * - Encapsulation: HTTP details are hidden behind clean methods
 * - Abstraction: Callers don't need to know about headers, etc.
 * ============================================================
 */

import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Generic API response interface.
 */
export interface ApiResponse<T = unknown> {
  status: number;
  statusText: string;
  data: T;
  headers: Record<string, string>;
}

/**
 * API Client class for RESTful API testing.
 */
export class ApiClient {
  private readonly request: APIRequestContext;
  private readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl?: string) {
    this.request = request;
    this.baseUrl = baseUrl || process.env.API_BASE_URL || 'https://the-internet.herokuapp.com';
  }

  // ============================================================
  // CORE HTTP METHODS
  // ============================================================

  /**
   * Send a GET request.
   *
   * @example
   * const response = await apiClient.get('/status_codes/200');
   * expect(response.status).toBe(200);
   */
  async get<T = unknown>(endpoint: string, options?: { headers?: Record<string, string> }): Promise<ApiResponse<T>> {
    console.log(`📡 GET ${this.baseUrl}${endpoint}`);
    const response = await this.request.get(`${this.baseUrl}${endpoint}`, {
      headers: options?.headers,
    });
    return this.parseResponse<T>(response);
  }

  /**
   * Send a POST request.
   *
   * @example
   * const response = await apiClient.post('/authenticate', {
   *   data: { username: 'admin', password: 'admin' }
   * });
   */
  async post<T = unknown>(
    endpoint: string,
    options?: { data?: unknown; headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    console.log(`📡 POST ${this.baseUrl}${endpoint}`);
    const response = await this.request.post(`${this.baseUrl}${endpoint}`, {
      data: options?.data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    return this.parseResponse<T>(response);
  }

  /**
   * Send a PUT request.
   */
  async put<T = unknown>(
    endpoint: string,
    options?: { data?: unknown; headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    console.log(`📡 PUT ${this.baseUrl}${endpoint}`);
    const response = await this.request.put(`${this.baseUrl}${endpoint}`, {
      data: options?.data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    return this.parseResponse<T>(response);
  }

  /**
   * Send a DELETE request.
   */
  async delete<T = unknown>(
    endpoint: string,
    options?: { headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    console.log(`📡 DELETE ${this.baseUrl}${endpoint}`);
    const response = await this.request.delete(`${this.baseUrl}${endpoint}`, {
      headers: options?.headers,
    });
    return this.parseResponse<T>(response);
  }

  /**
   * Send a PATCH request.
   */
  async patch<T = unknown>(
    endpoint: string,
    options?: { data?: unknown; headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    console.log(`📡 PATCH ${this.baseUrl}${endpoint}`);
    const response = await this.request.patch(`${this.baseUrl}${endpoint}`, {
      data: options?.data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    return this.parseResponse<T>(response);
  }

  // ============================================================
  // HELPER METHODS
  // ============================================================

  /**
   * Parse API response into our standard format.
   *
   * 📚 LEARNING NOTE:
   * We always parse responses into a consistent format.
   * This makes assertions cleaner in test files.
   */
  private async parseResponse<T>(response: APIResponse): Promise<ApiResponse<T>> {
    let data: T;
    const contentType = response.headers()['content-type'] || '';

    try {
      if (contentType.includes('application/json')) {
        data = await response.json() as T;
      } else {
        data = (await response.text()) as unknown as T;
      }
    } catch {
      data = (await response.text()) as unknown as T;
    }

    const result: ApiResponse<T> = {
      status: response.status(),
      statusText: response.statusText(),
      data,
      headers: response.headers() as Record<string, string>,
    };

    console.log(`📡 Response: ${result.status} ${result.statusText}`);
    return result;
  }

  /**
   * Validate response status code.
   */
  assertStatus(response: ApiResponse, expectedStatus: number): void {
    if (response.status !== expectedStatus) {
      throw new Error(
        `Expected status ${expectedStatus} but got ${response.status}. ` +
        `Response: ${JSON.stringify(response.data)}`
      );
    }
  }

  /**
   * Simple schema validation.
   *
   * 📚 LEARNING NOTE:
   * This is a basic schema validator. For production,
   * consider using Zod, Joi, or Ajv for robust validation.
   */
  validateSchema(data: unknown, requiredFields: string[]): { valid: boolean; missingFields: string[] } {
    const obj = data as Record<string, unknown>;
    const missingFields = requiredFields.filter((field) => !(field in obj));
    return {
      valid: missingFields.length === 0,
      missingFields,
    };
  }
}
