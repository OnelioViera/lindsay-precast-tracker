'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';

interface TimeTrackerProps {
  projectId: string;
  initialSeconds?: number;
  onTimeStart?: () => void;
  onTimeStop?: () => void;
}

export function TimeTracker({ projectId, initialSeconds = 0, onTimeStart, onTimeStop }: TimeTrackerProps) {
  const { addToast } = useToast();
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleStart = async () => {
    setLoading(true);
    try {
      console.log('Starting timer for project:', projectId);
      const res = await fetch(`/api/projects/${projectId}/time`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' }),
      });

      const data = await res.json();
      console.log('Start timer response:', data);

      if (res.ok) {
        setIsRunning(true);
        if (onTimeStart) {
          onTimeStart();
        }
        addToast({
          title: 'Timer Started',
          message: 'Time tracking is running',
          type: 'success',
        });
      } else {
        console.error('Failed to start timer:', data.message);
        if (data.message === 'Timer already running') {
          addToast({
            title: 'Timer Already Running',
            message: 'A timer is already running for this project. Click Stop to finish it first.',
            type: 'warning',
          });
        } else {
          addToast({
            title: 'Error',
            message: data.message || 'Failed to start timer',
            type: 'error',
          });
        }
      }
    } catch (error) {
      console.error('Failed to start timer:', error);
      addToast({
        title: 'Error',
        message: 'Failed to start timer. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      console.log('Stopping timer for project:', projectId);
      const res = await fetch(`/api/projects/${projectId}/time`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop' }),
      });

      const data = await res.json();
      console.log('Stop timer response:', data);

      if (res.ok) {
        setIsRunning(false);
        if (onTimeStop) {
          onTimeStop();
        }
      } else {
        console.error('Failed to stop timer:', data.message);
      }
    } catch (error) {
      console.error('Failed to stop timer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForceStop = async () => {
    setLoading(true);
    try {
      console.log('Force stopping timer for project:', projectId);
      const res = await fetch(`/api/projects/${projectId}/time`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop' }),
      });

      const data = await res.json();
      console.log('Force stop timer response:', data);

      if (res.ok) {
        setIsRunning(false);
        setSeconds(0);
        if (onTimeStop) {
          onTimeStop();
        }
        addToast({
          title: 'Timer Stopped',
          message: 'Running timer has been stopped and cleared',
          type: 'success',
        });
      } else {
        console.error('Failed to force stop timer:', data.message);
        addToast({
          title: 'Error',
          message: data.message || 'Failed to stop timer',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Failed to force stop timer:', error);
      addToast({
        title: 'Error',
        message: 'Failed to stop timer',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  return (
    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
      <div className="timer-display text-indigo-600 min-w-[100px]">
        {formatTime(seconds)}
      </div>
      <div className="flex gap-2">
        <Button
          variant="success"
          onClick={handleStart}
          disabled={isRunning || loading}
          className="px-3 py-1.5 text-xs"
        >
          Start
        </Button>
        <Button
          variant="destructive"
          onClick={handleStop}
          disabled={!isRunning || loading}
          className="px-3 py-1.5 text-xs"
        >
          Stop
        </Button>
        <Button
          variant="warning"
          onClick={handleForceStop}
          disabled={loading}
          className="px-3 py-1.5 text-xs"
        >
          Force Stop
        </Button>
        <Button
          variant="warning"
          onClick={handleReset}
          disabled={loading}
          className="px-3 py-1.5 text-xs"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}


