"""
OnPush Migration Helper Script
Usage: python migrate_onpush.py <component_file>
Example: python migrate_onpush.py src/app/_pages/home/home.page.ts

This script adds ChangeDetectionStrategy.OnPush to Angular components.
"""

import sys
import re
from pathlib import Path

def migrate_component(file_path: str) -> bool:
    """Migrate a single component to OnPush change detection."""
    
    path = Path(file_path)
    if not path.exists():
        print(f"❌ File not found: {file_path}")
        return False
    
    content = path.read_text(encoding='utf-8')
    original_content = content
    
    # Check if already migrated
    if 'ChangeDetectionStrategy.OnPush' in content:
        print(f"✅ Already migrated: {file_path}")
        return True
    
    # Check if it's a component file
    if '@Component' not in content:
        print(f"⚠️  Not a component file: {file_path}")
        return False
    
    # Step 1: Add ChangeDetectionStrategy to imports
    # Pattern 1: import { Component } from '@angular/core';
    pattern1 = r"(\bimport\s*{\s*)Component(\s*}\s*from\s*['\"]@angular/core['\"];)"
    if re.search(pattern1, content):
        content = re.sub(pattern1, r'\1Component, ChangeDetectionStrategy\2', content)
        print(f"  ✓ Added ChangeDetectionStrategy to imports")
    else:
        # Pattern 2: Component is already with other imports
        pattern2 = r"(\bimport\s*{)([^}]*)(Component)([^}]*)}\s*from\s*['\"]@angular/core['\"];"
        match = re.search(pattern2, content)
        if match:
            before = match.group(2)
            after = match.group(4)
            # Check if ChangeDetectionStrategy is not already there
            if 'ChangeDetectionStrategy' not in match.group(0):
                new_import = f"import {{{before}Component, ChangeDetectionStrategy{after}}}" + " from '@angular/core';"
                content = content.replace(match.group(0), new_import)
                print(f"  ✓ Added ChangeDetectionStrategy to existing imports")
            else:
                print(f"  ℹ️  ChangeDetectionStrategy already in imports")
        else:
            print(f"  ⚠️  Could not find Component import pattern")
            print(f"     Manual migration required for: {file_path}")
            return False
    
    # Step 2: Add changeDetection to @Component decorator
    # Find @Component({ and add changeDetection as a new line before selector
    decorator_pattern = r"(@Component\(\{)(\s*\n\s*selector:)"
    
    if re.search(decorator_pattern, content):
        content = re.sub(
            decorator_pattern,
            r'\1\n  changeDetection: ChangeDetectionStrategy.OnPush,\2',
            content,
            flags=re.DOTALL
        )
        print(f"  ✓ Added changeDetection: ChangeDetectionStrategy.OnPush")
    else:
        # Alternative: selector is on the same line as @Component({
        alt_pattern = r"(@Component\(\{\s*)(selector:)"
        if re.search(alt_pattern, content):
            content = re.sub(
                alt_pattern,
                r'\1\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  \2',
                content,
                flags=re.DOTALL
            )
            print(f"  ✓ Added changeDetection: ChangeDetectionStrategy.OnPush")
        else:
            print(f"  ⚠️  Could not find @Component decorator structure")
            print(f"     Manual migration required for: {file_path}")
            # Revert changes
            path.write_text(original_content, encoding='utf-8')
            return False
    
    # Write the updated content
    path.write_text(content, encoding='utf-8')
    print(f"✅ Migrated: {file_path}")
    
    # Show the changes
    print("\n   Modified lines:")
    lines = content.split('\n')
    for i, line in enumerate(lines, 1):
        if 'ChangeDetectionStrategy' in line:
            print(f"   Line {i}: {line}")
    
    return True

def main():
    if len(sys.argv) < 2:
        print("Usage: python migrate_onpush.py <component_file>")
        print("Example: python migrate_onpush.py src/app/_pages/home/home.page.ts")
        sys.exit(1)
    
    file_path = sys.argv[1]
    success = migrate_component(file_path)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()