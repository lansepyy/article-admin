import { useState } from 'react'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field.tsx'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button.tsx'

interface accountFormSchema {
  username: string
  password: string
}

export function AccountForm() {
  const [account, setAccount] = useState<accountFormSchema>({
    username:  '',
    password: '',
  })

  return (
    <div className='w-full max-w-md'>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel>用户名</FieldLabel>
            <Input
              type='text'
              value={account.username}
              onChange={(e) =>
                setAccount({ ...account, username: e.target.value })
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor='password'>密码</FieldLabel>
            <FieldDescription>至少8位</FieldDescription>
            <Input
              type='password'
              placeholder='••••••••'
              value={account.password}
              onChange={(e) =>
                setAccount({ ...account, password: e.target.value })
              }
            />
          </Field>
          <Field orientation="horizontal">
            <Button type="submit">提交</Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  )
}
