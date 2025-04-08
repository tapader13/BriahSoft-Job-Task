import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { RepositoryList } from './RepositoryList';
import { UserProfile } from './UserProfile';
import { CommitChart } from './CommitChart';

export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
}

export interface CommitData {
  date: string;
  count: number;
}

export function GitHubProfileAnalyzer() {
  const [username, setUsername] = useState('');
  const [inputUsername, setInputUsername] = useState('');
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [commitData, setCommitData] = useState<CommitData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    if (!inputUsername.trim()) return;

    setLoading(true);
    setError(null);
    setUser(null);
    setRepos([]);
    setCommitData([]);
    setUsername(inputUsername);

    try {
      // Fetch user profile (unchanged)
      const userResponse = await fetch(
        `https://api.github.com/users/${inputUsername}`,
        {
          headers: {
            Authorization: import.meta.env.VITE_GITHUB_TOKEN,
          },
        }
      );
      console.log(userResponse, 'userResponse');
      if (!userResponse.ok)
        throw new Error(`User not found or API rate limit exceeded`);
      const userData = await userResponse.json();
      setUser(userData);

      // Fetch repositories (unchanged)
      const reposResponse = await fetch(
        `https://api.github.com/users/${inputUsername}/repos?sort=updated&per_page=100`,
        {
          headers: {
            Authorization: import.meta.env.VITE_GITHUB_TOKEN,
          },
        }
      );
      if (!reposResponse.ok) throw new Error(`Failed to fetch repositories`);
      const reposData = await reposResponse.json();
      setRepos(reposData);

      // Get user's local timezone
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const commitCounts: CommitData[] = [];
      const today = new Date();

      const todayInUserTz = new Date(
        new Date().toLocaleString('en-US', { timeZone: userTimezone })
      );
      todayInUserTz.setHours(0, 0, 0, 0);

      for (let i = 0; i < 7; i++) {
        const date = new Date(todayInUserTz);
        date.setDate(todayInUserTz.getDate() - i);

        const displayDate = date.toLocaleDateString('en-US', {
          timeZone: userTimezone,
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        const startISO = startDate.toISOString();
        const endISO = endDate.toISOString();

        try {
          const searchResponse = await fetch(
            `https://api.github.com/search/commits?q=author:${inputUsername}+committer-date:${startISO}..${endISO}`,
            {
              headers: {
                Authorization: import.meta.env.VITE_GITHUB_TOKEN,
                Accept: 'application/vnd.github.cloak-preview',
              },
            }
          );

          if (searchResponse.ok) {
            const result = await searchResponse.json();
            // console.log(result, 'ok');
            commitCounts.push({
              date: displayDate,
              count: result.total_count,
            });
          } else {
            commitCounts.push({
              date: displayDate,
              count: 0,
            });
          }
        } catch (e) {
          commitCounts.push({
            date: displayDate,
            count: 0,
          });
        }
      }

      // Sort by date (oldest to newest)
      setCommitData(commitCounts.reverse());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    } finally {
      setLoading(false);
    }
  };
  console.log(commitData);
  return (
    <div className='space-y-6'>
      <Card>
        <CardContent className='pt-6'>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <Input
              placeholder='Enter GitHub username'
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchUserData()}
              className='flex-1'
            />
            <Button
              onClick={fetchUserData}
              disabled={loading || !inputUsername.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Loading
                </>
              ) : (
                'Analyze Profile'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {user && (
        <div className='space-y-6'>
          <UserProfile user={user} />

          <Tabs defaultValue='repositories'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='repositories'>Repositories</TabsTrigger>
              <TabsTrigger value='commits'>Commit Activity</TabsTrigger>
            </TabsList>
            <TabsContent value='repositories' className='mt-4'>
              <RepositoryList repos={repos} />
            </TabsContent>
            <TabsContent value='commits' className='mt-4'>
              <CommitChart commitData={commitData} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
