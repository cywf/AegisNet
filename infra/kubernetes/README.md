# AegisNet Kubernetes Manifests

This directory contains Kubernetes manifests for deploying AegisNet to any Kubernetes cluster.

## Structure

```
kubernetes/
├── deployment.yaml   # Main application deployment, services, and HPA
└── ingress.yaml      # Ingress configuration for external access
```

## Prerequisites

- Kubernetes cluster (v1.25+)
  - Local: Minikube, Kind, Docker Desktop
  - Cloud: EKS, GKE, AKS
  - Edge: K3s, MicroK8s
- kubectl configured to access your cluster
- Ingress controller installed (for ingress.yaml)

## Quick Start

### 1. Create Namespace

The namespace is defined in deployment.yaml, but you can also create it manually:

```bash
kubectl create namespace aegisnet
```

### 2. Create Secrets

Create secrets for sensitive data:

```bash
kubectl create secret generic aegisnet-secrets \
  --from-literal=DB_PASSWORD=your_secure_password \
  --from-literal=API_KEY=your_api_key \
  -n aegisnet
```

### 3. Deploy Application

```bash
kubectl apply -f deployment.yaml
kubectl apply -f ingress.yaml
```

### 4. Verify Deployment

```bash
# Check all resources
kubectl get all -n aegisnet

# Check deployment status
kubectl rollout status deployment/aegisnet-app -n aegisnet

# View pod logs
kubectl logs -f -l app=aegisnet -n aegisnet
```

## Manifest Details

### deployment.yaml

Contains:
- **Namespace**: Isolates AegisNet resources
- **ConfigMap**: Non-sensitive configuration
- **Secret**: Sensitive data (passwords, keys)
- **Deployment**: Application pods with replicas
- **Service**: Load balancer for external access
- **HorizontalPodAutoscaler**: Auto-scaling based on CPU/memory

### ingress.yaml

Configures external access with:
- TLS/SSL termination
- Domain routing
- cert-manager integration for automatic certificate management

## Customization

### Update Image

Edit deployment.yaml:
```yaml
containers:
- name: aegisnet
  image: your-registry/aegisnet:your-tag
```

### Adjust Resources

Modify resource requests and limits:
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### Configure Auto-scaling

Adjust HPA settings:
```yaml
spec:
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Update Ingress Domain

Edit ingress.yaml:
```yaml
spec:
  tls:
  - hosts:
    - your-domain.com
    secretName: aegisnet-tls
  rules:
  - host: your-domain.com
```

## Cluster-Specific Setup

### Amazon EKS

1. **Create cluster:**
```bash
eksctl create cluster \
  --name aegisnet-cluster \
  --region us-east-1 \
  --nodes 3
```

2. **Install AWS Load Balancer Controller:**
```bash
kubectl apply -k "github.com/aws/eks-charts/stable/aws-load-balancer-controller//crds?ref=master"
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=aegisnet-cluster
```

### Google GKE

1. **Create cluster:**
```bash
gcloud container clusters create aegisnet-cluster \
  --zone us-central1-a \
  --num-nodes 3
```

2. **Install Ingress:**
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
```

### Azure AKS

1. **Create cluster:**
```bash
az aks create \
  --resource-group aegisnet-rg \
  --name aegisnet-cluster \
  --node-count 3
```

2. **Get credentials:**
```bash
az aks get-credentials \
  --resource-group aegisnet-rg \
  --name aegisnet-cluster
```

### K3s (Edge/Lightweight)

1. **Install K3s:**
```bash
curl -sfL https://get.k3s.io | sh -
```

2. **Use K3s kubeconfig:**
```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
```

## Monitoring

### View Logs

```bash
# All pods
kubectl logs -f -l app=aegisnet -n aegisnet

# Specific pod
kubectl logs -f <pod-name> -n aegisnet

# Previous instance (if crashed)
kubectl logs -f <pod-name> -n aegisnet --previous
```

### Check Events

```bash
kubectl get events -n aegisnet --sort-by='.lastTimestamp'
```

### Describe Resources

```bash
kubectl describe deployment aegisnet-app -n aegisnet
kubectl describe pod <pod-name> -n aegisnet
kubectl describe service aegisnet-service -n aegisnet
```

## Troubleshooting

### Pods Not Starting

1. **Check pod status:**
```bash
kubectl get pods -n aegisnet
```

2. **Describe pod:**
```bash
kubectl describe pod <pod-name> -n aegisnet
```

3. **Check logs:**
```bash
kubectl logs <pod-name> -n aegisnet
```

### Image Pull Errors

- Verify image name and tag
- Check image registry authentication
- Ensure imagePullSecrets are configured if using private registry

### Service Not Accessible

1. **Check service:**
```bash
kubectl get svc -n aegisnet
```

2. **Port forward for testing:**
```bash
kubectl port-forward svc/aegisnet-service 8080:80 -n aegisnet
```

3. **Check ingress:**
```bash
kubectl get ingress -n aegisnet
kubectl describe ingress aegisnet-ingress -n aegisnet
```

### Resource Issues

- Check resource quotas
- Verify node resources
- Review HPA status

## Security Best Practices

1. **Use Secrets**: Never store sensitive data in ConfigMaps
2. **Network Policies**: Restrict pod-to-pod communication
3. **RBAC**: Implement role-based access control
4. **Pod Security**: Use security contexts and pod security policies
5. **Image Security**: Scan images for vulnerabilities

## Scaling

### Manual Scaling

```bash
kubectl scale deployment aegisnet-app --replicas=5 -n aegisnet
```

### Auto-scaling

HPA automatically scales based on metrics. Check status:
```bash
kubectl get hpa -n aegisnet
```

## Cleanup

Remove all resources:
```bash
kubectl delete -f ingress.yaml
kubectl delete -f deployment.yaml
kubectl delete namespace aegisnet
```

## Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
