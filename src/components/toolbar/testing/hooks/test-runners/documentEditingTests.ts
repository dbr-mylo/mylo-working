
import { Editor } from '@tiptap/react';
import { TestResult } from '../useToolbarTestResult';

/**
 * Runs tests for document editing operations
 * @param editor The editor instance to test
 * @returns Object containing test results
 */
export const runDocumentEditingTests = (
  editor: Editor | null
): Record<string, TestResult> => {
  const results: Record<string, TestResult> = {};
  
  // Skip tests if editor is not available
  if (!editor) {
    results['editor.instance'] = {
      name: 'Editor Instance',
      passed: false,
      message: 'Editor instance is not available',
      timestamp: new Date().toISOString()
    };
    return results;
  }
  
  // Test 1: Editor instance is available and active
  results['editor.instance'] = {
    name: 'Editor Instance',
    passed: !!editor && editor.isEditable,
    message: editor.isEditable 
      ? 'Editor is available and editable' 
      : 'Editor is not in editable state',
    timestamp: new Date().toISOString()
  };
  
  // Test 2: Text insertion
  try {
    const initialContent = editor.getHTML();
    editor.commands.insertContent('Test content');
    const updatedContent = editor.getHTML();
    const textInserted = updatedContent !== initialContent;
    
    results['editor.insertText'] = {
      name: 'Insert Text',
      passed: textInserted,
      message: textInserted 
        ? 'Successfully inserted text into editor' 
        : 'Failed to insert text into editor',
      timestamp: new Date().toISOString()
    };
    
    // Reset editor content
    editor.commands.setContent(initialContent);
  } catch (error) {
    results['editor.insertText'] = {
      name: 'Insert Text',
      passed: false,
      message: `Error when inserting text: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: new Date().toISOString()
    };
  }
  
  // Test 3: Bold formatting
  try {
    const initialContent = editor.getHTML();
    editor.commands.selectAll();
    editor.commands.setBold();
    const hasBoldMark = editor.isActive('bold');
    
    results['editor.formatting.bold'] = {
      name: 'Bold Formatting',
      passed: hasBoldMark,
      message: hasBoldMark 
        ? 'Successfully applied bold formatting' 
        : 'Failed to apply bold formatting',
      timestamp: new Date().toISOString()
    };
    
    // Reset editor content
    editor.commands.setContent(initialContent);
  } catch (error) {
    results['editor.formatting.bold'] = {
      name: 'Bold Formatting',
      passed: false,
      message: `Error when applying bold formatting: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: new Date().toISOString()
    };
  }
  
  // Test 4: Undo/Redo functionality
  try {
    const initialContent = editor.getHTML();
    editor.commands.insertContent('Test undo/redo');
    const contentAfterInsert = editor.getHTML();
    
    editor.commands.undo();
    const contentAfterUndo = editor.getHTML();
    
    editor.commands.redo();
    const contentAfterRedo = editor.getHTML();
    
    const undoWorks = contentAfterUndo === initialContent;
    const redoWorks = contentAfterRedo === contentAfterInsert;
    
    results['editor.undoRedo'] = {
      name: 'Undo/Redo Functionality',
      passed: undoWorks && redoWorks,
      message: undoWorks && redoWorks 
        ? 'Undo and redo functions work correctly' 
        : `${!undoWorks ? 'Undo failed. ' : ''}${!redoWorks ? 'Redo failed.' : ''}`,
      timestamp: new Date().toISOString()
    };
    
    // Reset editor content
    editor.commands.setContent(initialContent);
  } catch (error) {
    results['editor.undoRedo'] = {
      name: 'Undo/Redo Functionality',
      passed: false,
      message: `Error testing undo/redo: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: new Date().toISOString()
    };
  }
  
  // Test 5: Color application
  try {
    const initialContent = editor.getHTML();
    editor.commands.selectAll();
    editor.commands.setColor('#ff0000');
    
    const hasColorMark = editor.isActive('textStyle', { color: '#ff0000' });
    
    results['editor.formatting.color'] = {
      name: 'Text Color',
      passed: hasColorMark,
      message: hasColorMark 
        ? 'Successfully applied text color' 
        : 'Failed to apply text color',
      timestamp: new Date().toISOString()
    };
    
    // Reset editor content
    editor.commands.setContent(initialContent);
  } catch (error) {
    results['editor.formatting.color'] = {
      name: 'Text Color',
      passed: false,
      message: `Error applying text color: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: new Date().toISOString()
    };
  }
  
  return results;
};
