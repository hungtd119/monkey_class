export interface ProfileModel {
  app_id: number,
  is_web: 1
}


export interface ResourceProfileList<T> {
  data: T[];
  meta: {
    profile_list: any;
  };
}
