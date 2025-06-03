export interface Container {
  container_name?: string;
  image?: string;
  ports?: string[];
  environment?: { [key: string]: string } | string[];
  volumes?: string[];
  networks?: string[];
  depends_on?: string[];
  labels?: string[] | { [key: string]: string };
  restart?: string;
}

export interface Network {
  driver?: string;
  external?: boolean;
}

export interface ExtendProperties {
  icon?: string;
  tags?: string[];
  link?: string[] | string;
  protected: boolean;
}

export interface Compose {
  version?: string;
  services?: { [key: string]: Container };
  networks?: { [key: string]: Network };
  'x-dm'?: ExtendProperties;
  'x-dockge'?: ExtendProperties;
}
