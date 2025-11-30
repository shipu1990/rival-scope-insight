import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Music2, 
  Plus, 
  Unlink, 
  CheckCircle2,
  Loader2 
} from 'lucide-react';
import { 
  SocialPlatform, 
  ConnectedAccount 
} from '@/types/socialMedia';
import { 
  simulateOAuthConnection, 
  disconnectAccount, 
  getConnectedAccounts 
} from '@/lib/socialMediaServices';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const platformConfig: Record<SocialPlatform, { 
  name: string; 
  icon: React.ElementType; 
  color: string;
  bgColor: string;
}> = {
  facebook: { 
    name: 'Facebook', 
    icon: Facebook, 
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
  },
  instagram: { 
    name: 'Instagram', 
    icon: Instagram, 
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10 hover:bg-pink-500/20',
  },
  linkedin: { 
    name: 'LinkedIn', 
    icon: Linkedin, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/10 hover:bg-blue-600/20',
  },
  tiktok: { 
    name: 'TikTok', 
    icon: Music2, 
    color: 'text-foreground',
    bgColor: 'bg-foreground/10 hover:bg-foreground/20',
  },
};

export const ConnectedAccounts = () => {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>(getConnectedAccounts());
  const [connecting, setConnecting] = useState<SocialPlatform | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const handleConnect = async (platform: SocialPlatform) => {
    setConnecting(platform);
    try {
      const account = await simulateOAuthConnection(platform);
      setAccounts(getConnectedAccounts());
      toast.success(`Successfully connected ${platformConfig[platform].name}!`);
    } catch (error) {
      toast.error(`Failed to connect ${platformConfig[platform].name}`);
    }
    setConnecting(null);
  };

  const handleDisconnect = async (accountId: string, platform: SocialPlatform) => {
    setDisconnecting(accountId);
    await new Promise(resolve => setTimeout(resolve, 500));
    disconnectAccount(accountId);
    setAccounts(getConnectedAccounts());
    toast.success(`Disconnected ${platformConfig[platform].name}`);
    setDisconnecting(null);
  };

  const isConnected = (platform: SocialPlatform) => {
    return accounts.some(acc => acc.platform === platform);
  };

  const getAccountForPlatform = (platform: SocialPlatform) => {
    return accounts.find(acc => acc.platform === platform);
  };

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Plus className="h-5 w-5 text-primary" />
          Connect Social Accounts
        </CardTitle>
        <CardDescription>
          Connect your social media accounts to fetch real analytics data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.keys(platformConfig) as SocialPlatform[]).map((platform) => {
            const config = platformConfig[platform];
            const Icon = config.icon;
            const connected = isConnected(platform);
            const account = getAccountForPlatform(platform);
            const isConnecting = connecting === platform;
            const isDisconnecting = disconnecting === account?.id;

            return (
              <div
                key={platform}
                className={cn(
                  "flex items-center justify-between rounded-lg border p-4 transition-all",
                  connected 
                    ? "border-chart-success/30 bg-chart-success/5" 
                    : "border-border/50 bg-secondary/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", config.bgColor)}>
                    <Icon className={cn("h-5 w-5", config.color)} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{config.name}</p>
                    {connected && account ? (
                      <p className="text-xs text-muted-foreground">{account.accountName}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Not connected</p>
                    )}
                  </div>
                </div>
                {connected ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-chart-success/50 text-chart-success">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Connected
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDisconnect(account!.id, platform)}
                      disabled={isDisconnecting}
                    >
                      {isDisconnecting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Unlink className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConnect(platform)}
                    disabled={isConnecting}
                    className="gap-2"
                  >
                    {isConnecting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    Connect
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {accounts.length > 0 && (
          <div className="mt-4 rounded-lg border border-border/50 bg-secondary/20 p-4">
            <h4 className="mb-2 text-sm font-medium text-foreground">Connected Accounts</h4>
            <div className="space-y-2">
              {accounts.map((account) => {
                const config = platformConfig[account.platform];
                const Icon = config.icon;
                return (
                  <div key={account.id} className="flex items-center gap-3 text-sm">
                    <Icon className={cn("h-4 w-4", config.color)} />
                    <span className="text-foreground">{account.accountName}</span>
                    <span className="text-muted-foreground">
                      • Connected {new Date(account.connectedAt).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
