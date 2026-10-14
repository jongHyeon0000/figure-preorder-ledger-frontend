export interface CategorySaveRequestBody {
  /** 이름 (앞뒤 공백을 뺀 1~100자) */
  name: string;

  /** 설명 (1000자 이하). 비워 두면 서버에는 보내지 않고, 수정 때 보내지 않으면 설명이 지워진다 */
  description: string;
}
