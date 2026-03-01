import os
import json
import matplotlib.pyplot as plt

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
import torchvision.transforms as transforms
import PIL.Image as Image

latent_dim = 16
hidden_dim = 64
width = 20
height = 20
channels = 3
output_dim = width * height * channels

transform = transforms.Compose([
  transforms.Resize((width, height)),
  transforms.ToTensor(),
])

def open_tensor(path):
  image = Image.open(path).convert('RGB' if channels == 3 else 'L')
  return transform(image)

image_dir = 'encoder/train_dataset'
paths = [
  os.path.join(image_dir, img)
  for img in os.listdir(image_dir)
  if img.endswith(('.png', '.jpg', '.jpeg'))
]

dataset = [
  open_tensor(path) for path in paths
]


class VAE(nn.Module):
  def __init__(self):
    super().__init__()

    self.encoder = nn.Sequential(
      nn.Linear(output_dim, hidden_dim),
      nn.ReLU(),
    )

    self.fc_mu = nn.Linear(hidden_dim, latent_dim)
    self.fc_logvar = nn.Linear(hidden_dim, latent_dim)

    self.decoder = nn.Sequential(
      nn.Linear(latent_dim, hidden_dim),
      nn.ReLU(),
      nn.Linear(hidden_dim, output_dim),
      nn.Sigmoid(),
    )

  def encode(self, x):
    h = self.encoder(x)
    return self.fc_mu(h), self.fc_logvar(h)

  def reparameterize(self, mu, logvar):
    std = torch.exp(0.5 * logvar)
    eps = torch.randn_like(std)
    return mu + eps * std

  def decode(self, z):
    return self.decoder(z)

  def forward(self, x):
    mu, logvar = self.encode(x)
    z = self.reparameterize(mu, logvar)
    return self.decode(z), mu, logvar


device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
dataloader = DataLoader(torch.stack(dataset).to(device))

model = VAE().to(device)
optimizer = optim.Adam(model.parameters(), lr=0.001)

def loss_function(recon_x, x, mu, logvar):
  BCE = nn.functional.binary_cross_entropy(recon_x, x, reduction='sum')
  KLD = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())
  return BCE + KLD

for epoch in range(200):
  for data in dataloader:
    data = data.view(-1, output_dim)
    
    optimizer.zero_grad()
    recon, mu, logvar = model(data)
    loss = loss_function(recon, data, mu, logvar)
    loss.backward()
    optimizer.step()


def get_weight(name):
  return model.get_parameter(name).permute(1, 0).flatten().tolist()

def get_bias(name):
  return model.get_parameter(name).tolist()

w1 = get_weight('decoder.0.weight')
b1 = get_bias('decoder.0.bias')
w2 = get_weight('decoder.2.weight')
b2 = get_bias('decoder.2.bias')


model.eval()

with torch.no_grad():
  z = torch.randn(1, latent_dim).to(device)

  gen = model.decode(z)
  img = gen.cpu().view(channels, width, height)
  img = img.permute(1, 2, 0)

  plt.imshow(img)
  plt.title('Generated Image')
  plt.show()


with open('weights/output.json', 'w') as f:
  json.dump({
    'dim': {
      'latent_dim': latent_dim,
      'hidden_dim': hidden_dim,
      'width': width,
      'height': height,
      'channels': channels,
    },
    'weight': {
      'w1': w1,
      'b1': b1,
      'w2': w2,
      'b2': b2,
    },
  }, f, separators=(',', ':'))
