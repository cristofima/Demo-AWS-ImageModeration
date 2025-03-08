import { ModerationLabel } from '@aws-sdk/client-rekognition';
import { thresholds } from 'src/constants/category-thresholds.constant';
import { Hierarchy } from 'src/types/hierarchy.type';
import { Status } from 'src/types/status.type';

export class ModerationUtil {
  public static getModerationStatus(labels: ModerationLabel[]): Status {
    const hierarchy = ModerationUtil.groupByHierarchy(labels);
    return ModerationUtil.validateImageWithPriorities(hierarchy);
  }

  private static groupByHierarchy(labels: ModerationLabel[]): Hierarchy {
    const hierarchy: Hierarchy = {};

    // Helper map to track nodes by Name for quick reference
    const nodesMap: { [key: string]: any } = {};

    labels.forEach((label) => {
      const { Name, ParentName, Confidence } = label;

      // Create a new node for the current label if it doesn't exist
      if (!nodesMap[Name]) {
        nodesMap[Name] = ParentName ? { Confidence } : {};
      }

      // If the label has a parent, attach it to the parent's node
      if (ParentName) {
        if (!nodesMap[ParentName]) {
          nodesMap[ParentName] = {};
        }

        // Ensure the parent node includes the current node
        nodesMap[ParentName][Name] = nodesMap[Name];
      } else {
        // Top-level labels go directly into the hierarchy
        hierarchy[Name] = nodesMap[Name];
      }
    });

    return hierarchy;
  }

  private static validateImageWithPriorities(hierarchy: Hierarchy): Status {
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

    function findDeepestNode(
      node: any,
      currentPath: string[] = [],
    ): { confidence: number | null; path: string[] } {
      if (typeof node !== 'object' || node === null) {
        return { confidence: null, path: [] };
      }

      let deepestNode: { confidence: number | null; path: string[] } = {
        confidence: null,
        path: [],
      };

      for (const [subKey, value] of Object.entries(node)) {
        if (
          subKey === 'Confidence' &&
          typeof value === 'number' &&
          Object.keys(node).length === 1
        ) {
          deepestNode = { confidence: value, path: currentPath };
        } else if (typeof value === 'object') {
          const subNode = findDeepestNode(value, [...currentPath, subKey]);
          if (
            subNode.confidence !== null &&
            (deepestNode.confidence === null ||
              subNode.path.length > deepestNode.path.length)
          ) {
            deepestNode = subNode;
          }
        }
      }

      return deepestNode;
    }

    for (const category of priorities) {
      if (category in hierarchy) {
        const { confidence, path } = findDeepestNode(hierarchy[category]);
        if (confidence !== null) {
          let currentThresholds = thresholds[category];

          for (const key of path) {
            if (
              currentThresholds &&
              typeof currentThresholds === 'object' &&
              key in currentThresholds
            ) {
              currentThresholds = currentThresholds[key] as any;
            } else {
              break;
            }
          }

          if (
            currentThresholds &&
            typeof currentThresholds === 'object' &&
            'blur' in currentThresholds &&
            'reject' in currentThresholds
          ) {
            if (
              typeof currentThresholds.reject === 'number' &&
              confidence >= currentThresholds.reject
            ) {
              return 'REJECTED';
            } else if (
              typeof currentThresholds.blur === 'number' &&
              confidence >= currentThresholds.blur
            ) {
              return 'BLURRED';
            }
          }
        }
      }
    }

    return 'APPROVED';
  }
}
