import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { CommonModule } from '@angular/common';

declare const require: any; // Para usar el loader de Monaco
declare const monaco: any;  // Referencia global de Monaco

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MonacoEditorModule, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  editor: any;
  sqlCode: string = `-- Escribe tu consulta SQL aquí\nSELECT * FROM users;`;
  executionMessage: string = ''; // Mensaje de ejecución

  ngAfterViewInit() {
    this.loadMonacoEditor();
  }

  loadMonacoEditor() {
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
    
    require(['vs/editor/editor.main'], () => {
      this.editor = monaco.editor.create(this.editorContainer.nativeElement, {
        value: this.sqlCode,
        language: 'sql',
        theme: 'vs-dark', // Tema oscuro
        automaticLayout: true,
        minimap: { enabled: false }
      });

      // Escuchar cambios en el editor y actualizar sqlCode
      this.editor.onDidChangeModelContent(() => {
        this.sqlCode = this.editor.getValue();
      });
    });
  }

  // Método para actualizar el editor desde el input de ngModel
  updateEditor() {
    if (this.editor) {
      this.editor.setValue(this.sqlCode);
    }
  }
  executeSQL() {
    this.executionMessage = "✅ Consulta ejecutada con éxito!";
    setTimeout(() => {
      this.executionMessage = ""; // Ocultar mensaje después de 3 segundos
    }, 3000);
  }
}
