export const getRelativeUrl = (absoluteUrl: string): string => {
  return `/${absoluteUrl.split('/').splice(3, 100).join('/')}`.replace(/\/\//g, '/');
};
