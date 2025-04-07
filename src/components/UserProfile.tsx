import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, GitFork, Calendar } from 'lucide-react';
import { GitHubUser } from './GitHubProfileAnalyzer';

interface UserProfileProps {
  user: GitHubUser;
}

export function UserProfile({ user }: UserProfileProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex flex-col gap-6 md:flex-row'>
          <div className='flex-shrink-0'>
            <Avatar className='h-24 w-24'>
              <AvatarImage src={user.avatar_url} alt={user.login} />
              <AvatarFallback>
                {user.login.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className='flex-1 space-y-4'>
            <div>
              <h2 className='text-2xl font-bold'>{user.name || user.login}</h2>
              <a
                href={user.html_url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:underline'
              >
                @{user.login}
              </a>
            </div>

            {user.bio && <p>{user.bio}</p>}

            <div className='flex flex-wrap gap-4'>
              <div className='flex items-center gap-2'>
                <GitFork className='h-4 w-4 text-muted-foreground' />
                <span>{user.public_repos} repositories</span>
              </div>
              <div className='flex items-center gap-2'>
                <Users className='h-4 w-4 text-muted-foreground' />
                <span>
                  {user.followers} followers · {user.following} following
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <span>Joined {formatDate(user.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
