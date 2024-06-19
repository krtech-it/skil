export interface IRating{ //task rating
    place: number,
    userId: string,
    userFullName: string,
    finishTime?: string, 
    grade: string,
}

export interface IUserRating{
  place: number,
  userId: string,
  userFullName: string,
  grade: string,
}

export interface IStatisticUser{
   id: string,
   fullName: string,
}