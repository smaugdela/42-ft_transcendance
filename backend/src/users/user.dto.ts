export default interface UserDto {
  id: number;
  avatar: string;
  nickname: string;
  mailAddress?: string;
  coalition: string;
  nbGames: number;
  score: number;
  rank: number;
  isLogged: boolean;
  friendsList: UserDto[];
  blockList: UserDto[];
  pendingList: UserDto[];
  isActive: boolean;
}
