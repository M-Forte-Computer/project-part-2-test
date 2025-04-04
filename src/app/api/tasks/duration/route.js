import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskCreatedAt = searchParams.get('createdAt');
    if (!taskCreatedAt) {
      console.error('Task creation time is missing');
      return NextResponse.json({ error: 'Task creation time is required' }, { status: 400 });
    }

    const response = await fetch(`https://timeapi.io/api/Time/current/zone?timeZone=UTC`);
    if (!response.ok) {
      throw new Error('Failed to fetch current time from TimeAPI');
    }

    const currentTimeData = await response.json();
    const currentTime = new Date(currentTimeData.dateTime);

    const createdAt = new Date(taskCreatedAt);
    const durationInMilliseconds = currentTime - createdAt;
    const durationInHours = Math.floor(durationInMilliseconds / (1000 * 60 * 60));

    return NextResponse.json({ duration: `${durationInHours} hours` });
  } catch (error) {
    console.error('Error fetching task duration:', error.message);
    return NextResponse.json({ error: 'Failed to fetch task duration', details: error.message }, { status: 500 });
  }
}
