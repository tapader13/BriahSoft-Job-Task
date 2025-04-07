import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, GitFork, Clock } from 'lucide-react';
import { GitHubRepo } from './GitHubProfileAnalyzer';

interface RepositoryListProps {
  repos: GitHubRepo[];
}

export function RepositoryList({ repos }: RepositoryListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (repos.length === 0) {
    return (
      <Card>
        <CardContent className='p-6'>
          <p className='text-center text-muted-foreground'>
            No repositories found
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-4'>
      {repos.map((repo) => (
        <Card key={repo.id}>
          <CardHeader className='pb-2'>
            <div className='flex items-start justify-between'>
              <div>
                <CardTitle className='text-xl'>
                  <a
                    href={repo.html_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:underline'
                  >
                    {repo.name}
                  </a>
                </CardTitle>
                {repo.description && (
                  <CardDescription className='mt-1'>
                    {repo.description}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap items-center gap-4'>
              {repo.language && (
                <Badge variant='outline'>{repo.language}</Badge>
              )}

              <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                <Star className='h-4 w-4' />
                <span>{repo.stargazers_count}</span>
              </div>

              <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                <GitFork className='h-4 w-4' />
                <span>{repo.forks_count}</span>
              </div>

              <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                <Clock className='h-4 w-4' />
                <span>Updated on {formatDate(repo.updated_at)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
