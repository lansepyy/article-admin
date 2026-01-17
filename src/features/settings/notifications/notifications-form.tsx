import { Separator } from '@radix-ui/react-separator';
import { Card, CardContent} from '@/components/ui/card.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Input } from '@/components/ui/input.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Switch } from '@/components/ui/switch.tsx'



function SettingSwitch({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      <Switch />
    </div>
  )
}

function FormItem({
                    label,
                    children,
                  }: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

export function NotificationsForm() {
  const wxTemplate=`📁 板块：{{section}} / {{type}}\n
📦 体积：{{size}}\n
🗓 发布：{{publish_date}}\n
⬇️ 下载器：{{downloader}}\n
📂 保存目录：{{save_path}}\n
🔗 Magnet：\n
{{magnet}}`
  const tgTemplate=`🚀 {{title}}\n\n
📁 板块：{{section}} / {{type}}\n
📦 体积：{{size}}\n
🗓 发布：{{publish_date}}\n
⬇️ 下载器：{{downloader}}\n
📂 保存目录：{{save_path}}\n
🔗 Magnet：\n
{{magnet}}`
  return (
    <Tabs defaultValue='wechat' className='w-full'>
      <TabsList>
        <TabsTrigger value='wechat'>企业微信</TabsTrigger>
        <TabsTrigger value='telegram'>Telegram</TabsTrigger>
      </TabsList>

      <TabsContent value='wechat'>
        <Card>
          <CardContent className='space-y-6'>
            <SettingSwitch label='启用企业微信通知' />
            <SettingSwitch label='推送图片' />
            <Separator />
            <FormItem label='企业 ID'>
              <Input placeholder='WECHAT_CORP_ID' />
            </FormItem>

            <FormItem label='企业密钥'>
              <Input placeholder='WECHAT_CORP_SECRET' />
            </FormItem>

            <FormItem label='应用 ID'>
              <Input placeholder='WECHAT_AGENT_ID' />
            </FormItem>

            <FormItem label='Token'>
              <Input placeholder='WECHAT_TOKEN' />
            </FormItem>

            <FormItem label='EncodingAESKey'>
              <Input placeholder='WECHAT_ENCODING_AES_KEY' />
            </FormItem>

            <FormItem label='推送用户'>
              <Input placeholder='@all' />
            </FormItem>

            <FormItem label='推送代理'>
              <Input placeholder='http://127.0.0.1:1234' />
            </FormItem>

            <Separator />

            <FormItem label='消息模板'>
              <Textarea
                rows={5}
                placeholder={wxTemplate}
              />
            </FormItem>

            <Button>保存配置</Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ================= Telegram ================= */}
      <TabsContent value='telegram'>
        <Card>
          <CardContent className='space-y-6'>
            <SettingSwitch label='启用 Telegram 通知' />
            <SettingSwitch label='推送图片' />
            <SettingSwitch label='启用剧透（Spoiler）' />

            <Separator />

            <FormItem label='Bot Token'>
              <Input placeholder='TELEGRAM_BOT_TOKEN' />
            </FormItem>

            <FormItem label='Chat ID'>
              <Input placeholder='TELEGRAM_CHAT_ID' />
            </FormItem>

            <Separator />

            <FormItem label='消息模板'>
              <Textarea
                rows={5}
                placeholder={tgTemplate}
              />
            </FormItem>

            <Button>保存配置</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
