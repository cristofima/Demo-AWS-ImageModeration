import { ModerationLabel } from '@aws-sdk/client-rekognition';
import { thresholds } from 'src/domain/constants/category-thresholds.constant';
import { Hierarchy } from 'src/domain/types/hierarchy.type';
import { Status } from 'src/domain/types/status.type';

export function getModerationStatus(labels: ModerationLabel[]): Status {
  const hierarchy = groupByHierarchy(labels);
  return validateImageWithPriorities(hierarchy);
}

function groupByHierarchy(labels: ModerationLabel[]): Hierarchy {
  const hierarchy: Hierarchy = {};

  // Helper map to track nodes by Name for quick reference
  const nodesMap: { [key: string]: any } = {};

  labels.forEach((label) => {
    const { Name, ParentName, Confidence } = label;

    // Create a new node for the current label if it doesn't exist
    nodesMap[Name] ??= ParentName ? { Confidence } : {};

    // If the label has a parent, attach it to the parent's node
    if (ParentName) {
      nodesMap[ParentName] ??= {};

      // Ensure the parent node includes the current node
      nodesMap[ParentName][Name] = nodesMap[Name];
    } else {
      // Top-level labels go directly into the hierarchy
      hierarchy[Name] = nodesMap[Name];
    }
  });

  return hierarchy;
}

function validateImageWithPriorities(hierarchy: Hierarchy): Status {
  const priorities = [
    'Explicit',
    'Non-Explicit Nudity of Intimate parts and Kissing',
    'Swimwear or Underwear',
    'Violence',
    'Visually Disturbing',
    'Drugs & Tobacco',
    'Alcohol',
    'Rude Gestures',
    'Hate Symbols',
  ];

  for (const category of priorities) {
    const categoryNode = hierarchy[category];
    if (!categoryNode) continue;

    const { confidence, path } = findDeepestNode(categoryNode);
    if (confidence === null) continue;

    const categoryThresholds = resolveThresholdPath(thresholds[category], path);
    const status = evaluateStatus(confidence, categoryThresholds);
    if (status !== 'APPROVED') return status;
  }

  return 'APPROVED';
}

function findDeepestNode(
  node: any,
  currentPath: string[] = [],
): { confidence: number | null; path: string[] } {
  if (typeof node !== 'object' || node === null) {
    return { confidence: null, path: [] };
  }

  if (
    'Confidence' in node &&
    typeof node.Confidence === 'number' &&
    Object.keys(node).length === 1
  ) {
    return { confidence: node.Confidence, path: currentPath };
  }

  let deepest: { confidence: number | null; path: string[] } = {
    confidence: null,
    path: [],
  };

  for (const [key, value] of Object.entries(node)) {
    if (typeof value === 'object') {
      const result = findDeepestNode(value, [...currentPath, key]);
      if (
        result.confidence !== null &&
        result.path.length > deepest.path.length
      ) {
        deepest = result;
      }
    }
  }

  return deepest;
}

function resolveThresholdPath(thresholdNode: any, path: string[]): any {
  let current = thresholdNode;
  for (const key of path) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return null;
    }
  }
  return current;
}

function evaluateStatus(confidence: number, thresholds: any): Status {
  if (!thresholds || typeof thresholds !== 'object') return 'APPROVED';

  const { reject, blur } = thresholds;
  if (typeof reject === 'number' && confidence >= reject) return 'REJECTED';
  if (typeof blur === 'number' && confidence >= blur) return 'BLURRED';

  return 'APPROVED';
}
