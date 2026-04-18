// API hostname must match k8s/ingress.yaml (chefin-api.local) and /etc/hosts or DNS.
export const environment = {
  production: true,
  apiUrl: 'http://chefin-api.local',
};
