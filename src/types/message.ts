export interface GroupInfo {
  groupId: string;
  groupName: string;
  memberName: string;
}

export interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
  isIncoming: boolean;
  chatId: string;
  chatType?: string;
  chatTitle?: string;
  isGroupMessage?: boolean;
  groupInfo?: GroupInfo;
}