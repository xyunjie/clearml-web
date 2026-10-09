import { Injectable } from '@angular/core';

export interface Error {
  meta: {
    result_code: number;
    result_subcode: number;
    result_msg: string;
    error_data?: any;
  };
  data: any;
}
@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  template(strings, ...keys) {
    return (values => {
      const result = [strings[0]];
      keys.forEach((key, i) => {
        const value = values[key];
        result.push(value, strings[i + 1]);
      });
      return result.join('');
    });
  }

  private codes = {
    400: {
      12: this.template`字段超出允许的值`,
      50: this.template`账户的凭据数量已达上限。`,
      51: this.template`当前无法完成此操作，请稍后重试。\n${'resultMsg'}`,
      52: this.template`无法完成身份验证，身份提供商可能暂时不可用，请稍后重试`,
      53: this.template`无法完成身份验证，身份提供商可能暂时不可用，请稍后重试`,
      54: this.template`无法解析链接目标，请联系向你提供链接的人以加入其团队。`,
      55: this.template`无法完成身份验证，注册会话可能已超时，请重试。
** 如果问题持续存在，身份提供商可能暂时不可用，请稍后重试。`,
      56: this.template`加入 ${'user_name'} 团队的邀请已过期。请联系 ${'user_name'} 加入其团队，或注册一个免费的独立账户。`,
      57: this.template`该 ${'provider'} 身份已有账户，请改用“登录”。`,
      58: this.template`账户不存在。请使用注册时的身份提供商，或注册新账户`,
      62: this.template`请查收邮件以继续完成注册`,
      67: this.template`${'email'} 无权访问 ClearML，请联系管理员将该地址加入白名单`,
      86: this.template`无法停用最后一个 SSO 配置`,
      92: this.template`无法登录租户 ${'tenant'}，用户不属于该租户`,
      1205: this.template`此工作区的并发运行实例数已达上限。`,
      505: this.template`此版本当前关联了一个或多个标注任务 ${'tasks'}`,
      509: this.template`无法编辑已发布版本中帧的元数据。`
    }
  };

  getErrorMsg(error: Error, extraParams: Record<string, string> = {}) {
    const template = this.codes?.[error?.meta?.result_code]?.[error?.meta?.result_subcode];
    if (template) {
      let params = {resultMsg: error?.meta?.result_msg, ...extraParams};
      if (error?.meta?.error_data) {
        params = {...error.meta.error_data, ...params};
      }
      try {
        return template(params);
      } catch {
        console.warn('failed to render error message', error);
      }
    }
    return error?.meta?.result_msg || '';
  }

  lastRunError(error: Error) {
    return error?.meta?.result_code === 400 && error?.meta?.result_subcode === 160;
  }
}
