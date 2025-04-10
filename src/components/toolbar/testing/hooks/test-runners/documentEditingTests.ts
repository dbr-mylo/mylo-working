
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
  
  // Test 4: Undo/Redo functionality - Improved implementation
  try {
    // Start with fresh content
    const initialContent = '<p>Initial content for undo/redo test</p>';
    editor.commands.setContent(initialContent);
    
    // Insert distinctive content that we can track
    const testContent = 'UNIQUE_TEST_CONTENT_FOR_UNDO_REDO';
    editor.commands.insertContent(testContent);
    
    // Verify that insertion worked
    const contentAfterInsert = editor.getHTML();
    const insertSuccessful = contentAfterInsert.includes(testContent);
    
    if (!insertSuccessful) {
      results['editor.undoRedo'] = {
        passed: false,
        message: 'Could not test undo/redo as content insertion failed',
        name: 'Undo/Redo Functionality',
        timestamp: new Date().toISOString()
      };
    } else {
      // Perform undo operation
      editor.commands.undo();
      const contentAfterUndo = editor.getHTML();
      
      // Check if undo removed our test content
      const undoWorks = !contentAfterUndo.includes(testContent);
      
      // Now redo to get back our test content
      editor.commands.redo();
      const contentAfterRedo = editor.getHTML();
      
      // Check if redo restored our test content
      const redoWorks = contentAfterRedo.includes(testContent);
      
      results['editor.undoRedo'] = {
        passed: undoWorks && redoWorks,
        message: undoWorks && redoWorks 
          ? 'Undo and redo functions work correctly' 
          : `${!undoWorks ? 'Undo failed: test content still present after undo. ' : ''}${!redoWorks ? 'Redo failed: test content not restored after redo.' : ''}`,
        name: 'Undo/Redo Functionality',
        timestamp: new Date().toISOString()
      };
      
      // For diagnostics, add content details to the message if the test failed
      if (!undoWorks || !redoWorks) {
        const details = {
          initialContent,
          contentAfterInsert,
          contentAfterUndo,
          contentAfterRedo,
        };
        
        results['editor.undoRedo'].message += ` Debug details: ${JSON.stringify(details)}`;
      }
    }
    
    // Reset editor to a clean state
    editor.commands.setContent('<p></p>');
  } catch (error) {
    results['editor.undoRedo'] = {
      passed: false,
      message: `Error testing undo/redo: ${error instanceof Error ? error.message : String(error)}`,
      name: 'Undo/Redo Functionality',
      timestamp: new Date().toISOString()
    };
  }
  
  // Test 5: Color application - Fixed implementation with proper methods
  try {
    // First, try multiple ways to set text color based on different extension patterns
    const initialContent = editor.getHTML();
    editor.commands.selectAll();
    
    let colorApplied = false;
    let colorMethod = '';
    
    // Try different ways to apply color based on the editor's configuration
    // Method 1: Using setColor from the Color extension
    if (typeof editor.commands.setColor === 'function') {
      editor.commands.setColor('#ff0000');
      colorApplied = true;
      colorMethod = 'direct setColor method';
    } 
    // Method 2: Using the updateAttributes with TextStyle extension
    else if (typeof editor.chain === 'function') {
      try {
        // Use updateAttributes instead of setTextStyle
        editor.chain().focus().updateAttributes('textStyle', { color: '#ff0000' }).run();
        colorApplied = true;
        colorMethod = 'TextStyle updateAttributes';
      } catch (e) {
        console.log("TextStyle method failed:", e);
      }
    }
    
    if (!colorApplied) {
      results['editor.formatting.color'] = {
        passed: false,
        message: 'Editor does not support color formatting. Make sure Color extension and TextStyle extensions are added to the editor.',
        name: 'Text Color',
        timestamp: new Date().toISOString()
      };
    } else {
      // Different editors might handle this differently, so check multiple ways
      const hasColorMark = editor.isActive('textStyle', { color: '#ff0000' }) || 
                          editor.getHTML().includes('color: #ff0000') ||
                          editor.getHTML().includes('color:#ff0000') ||
                          editor.getHTML().includes('style="color:') ||
                          editor.getHTML().toLowerCase().includes('style="color');
      
      results['editor.formatting.color'] = {
        passed: hasColorMark,
        message: hasColorMark 
          ? `Successfully applied text color using ${colorMethod}` 
          : `Failed to apply text color using ${colorMethod}. HTML after application: ${editor.getHTML().substring(0, 100)}...`,
        name: 'Text Color',
        timestamp: new Date().toISOString()
      };
    }
    
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
