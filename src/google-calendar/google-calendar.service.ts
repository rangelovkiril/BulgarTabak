import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleCalendarService {
  private calendar: any;

  constructor(private readonly httpService: HttpService) {}

  private getOAuthClient(googleAccessToken: string): OAuth2Client {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: googleAccessToken,
    });
    return oauth2Client;
  }

  // Fetch events from Google Calendar
  async getCalendarEvents(googleAccessToken: string, calendarId: string, timeMin: string, timeMax: string): Promise<any[]> {
    const oauth2Client = this.getOAuthClient(googleAccessToken);
    this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    try {
      const events = await this.calendar.events.list({
        calendarId,
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return events.data.items || [];
    } catch (error) {
      const errorMessage = (error as any).message || 'Unknown error';
      throw new Error(`Failed to fetch events from Google Calendar: ${errorMessage}`);
    }
}