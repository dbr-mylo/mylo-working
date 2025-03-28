
import { Editor } from '@tiptap/react';
import { TestResult } from '../useToolbarTestResult';

/**
 * Runs tests for document editing operations
 * @param editor The editor instance to test
 * @returns Promise resolving to an object containing test results
 */
export const runDocumentEditingTests = async (
  editor: Editor | null
): Promise<Record<string, TestResult>> => {
  const results: Record<string, TestResult> = {};
  
  // Skip tests if editor is not available
  if (!editor) {
    results['editor.instance'] = {
      passed: false,
      message: 'Editor instance is not available',
      name: 'Editor Instance',
      timestamp: new Date().toISOString()
    };
    return results;
  }
  
  // Test 1: Editor instance is available and active
  results['editor.instance'] = {
    passed: !!editor && editor.isEditable,
    message: editor.isEditable 
      ? 'Editor is available and editable' 
      : 'Editor is not in editable state',
    name: 'Editor Instance',
    timestamp: new Date().toISOString()
  };
  
  // Test 2: Text insertion
  try {
    const initialContent = editor.getHTML();
    editor.commands.insertContent('Test content');
    const updatedContent = editor.getHTML();
    const textInserted = updatedContent !== initialContent;
    
    results['editor.insertText'] = {
      passed: textInserted,
      message: textInserted 
        ? 'Successfully inserted text into editor' 
        : 'Failed to insert text into editor',
      name: 'Insert Text',
      timestamp: new Date().toISOString()
    };
    
    // Reset editor content
    editor.commands.setContent(initialContent);
  } catch (error) {
    results['editor.insertText'] = {
      passed: false,
      message: `Error when inserting text: ${error instanceof Error ? error.message : String(error)}`,
      name: 'Insert Text',
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
      passed: hasBoldMark,
      message: hasBoldMark 
        ? 'Successfully applied bold formatting' 
        : 'Failed to apply bold formatting',
      name: 'Bold Formatting',
      timestamp: new Date().toISOString()
    };
    
    // Reset editor content
    editor.commands.setContent(initialContent);
  } catch (error) {
    results['editor.formatting.bold'] = {
      passed: false,
      message: `Error when applying bold formatting: ${error instanceof Error ? error.message : String(error)}`,
      name: 'Bold Formatting',
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
      passed: undoWorks && redoWorks,
      message: undoWorks && redoWorks 
        ? 'Undo and redo functions work correctly' 
        : `${!undoWorks ? 'Undo failed. ' : ''}${!redoWorks ? 'Redo failed.' : ''}`,
      name: 'Undo/Redo Functionality',
      timestamp: new Date().toISOString()
    };
    
    // Reset editor content
    editor.commands.setContent(initialContent);
  } catch (error) {
    results['editor.undoRedo'] = {
      passed: false,
      message: `Error testing undo/redo: ${error instanceof Error ? error.message : String(error)}`,
      name: 'Undo/Redo Functionality',
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
      passed: hasColorMark,
      message: hasColorMark 
        ? 'Successfully applied text color' 
        : 'Failed to apply text color',
      name: 'Text Color',
      timestamp: new Date().toISOString()
    };
    
    // Reset editor content
    editor.commands.setContent(initialContent);
  } catch (error) {
    results['editor.formatting.color'] = {
      passed: false,
      message: `Error applying text color: ${error instanceof Error ? error.message : String(error)}`,
      name: 'Text Color',
      timestamp: new Date().toISOString()
    };
  }
  
  return results;
};
