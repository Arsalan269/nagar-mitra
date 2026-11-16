import { Droplets, Trash2, Construction, Zap, Waves } from 'lucide-react';
import { getCategoryById } from '../../utils/helpers';

const iconMap = { Droplets, Trash2, Construction, Zap, Waves };

export default function CategoryIcon({ categoryId, size = 24 }) {
  const cat = getCategoryById(categoryId);
  if (!cat) return null;
  const Icon = iconMap[cat.icon];
  if (!Icon) return null;
  return <Icon size={size} color={cat.color} />;
}
