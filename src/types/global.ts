export interface LoginData {
  access_token: string;
  user_id: number;
  f_token: any;
  phone_order: any;
  expires_in: number;
}

export interface ProfileData {
  [x: string]: any;
  userName: string;
  user_id: number;
}
export interface RawCurrentUser {
  id: number;
  name: string;
  date_of_birth?: number;
  phone?: string;
  email: string;
  avatar?: string;
}

export interface ResponseLinks {
  first: string;
  last: string;
  prev: null;
  next: null;
}

export interface ResponseMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}
export interface ResponseSuccess {
  status: string;
  message?: string;
  data: any;
  code: number;
}

export interface ResponseError {
  status: string;
  message?: string;
  data: any;
  code: number;
}

export interface ResponseErrors {
  status: number;
  message?: string;
  errors: {
    field: string;
    message: string;
  }[];
}
export interface ModalType {
  title?: string;
  content?: string;
  titleStyle?: any;
  modalProps?: any;
  contentStyle?: any;
  activeButton?: {
    text?: string;
    onPress?: () => void;
  };
  disabledCloseBtn?: boolean;
  ignoreButton?: {
    text?: string;
    onPress?: () => void;
  };
}
export interface OverViewItem {
	src: string;
	title: string;
	value: string;
}
export interface DataType {
	key: string;
	name: string;
	age: number;
	address: string;
	tags: string[];
}
