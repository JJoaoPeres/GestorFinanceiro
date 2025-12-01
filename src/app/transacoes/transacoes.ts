import { Component, OnInit, inject } from '@angular/core';
import { TransacaoService, Transacao } from '../transacao-service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transacoes',
  imports: [FormsModule, DatePipe],
  templateUrl: './transacoes.html',
  standalone: true,
  styleUrl: './transacoes.css',
})
export class Transacoes implements OnInit {
  private api = inject(TransacaoService);

  transacoes: Transacao[] = [];
  carregando = false;
  salvando = false;
  erro = '';

  totalEntradas = 0;
  totalSaidas = 0;
  saldo = 0;


  type: 'income' | 'expense' | '' = '';
  category = '';
  value: number | null = null;
  date = '';
  description = '';

  filtroCategoria = '';

  ngOnInit(): void {
    this.carregar();
  }

  carregar() {
    this.carregando = true;

    this.api.listar().subscribe({
      next: xs => {
        this.transacoes = xs;
        this.carregando = false;

        this.calcularSaldo();
      },
      error: e => {
        this.erro = e.message ?? 'Falha ao carregar';
        this.carregando = false;
      }
    });
  }

  criar() {

    if (!this.type || !this.category || this.value == null || !this.date) {
      return;
    }

    //objeto completo no formato da interface Transacao antes de enviar para o backend.
    const transacao: Transacao = {
      type: this.type,
      category: this.category,  
      value: Number(this.value),
      date: this.date,
      description: this.description
    };

    this.salvando = true;

    this.api.criar(transacao).subscribe({
      next: () => {

        this.type = '';
        this.category = '';
        this.value = null;
        this.date = '';
        this.description = '';

        this.salvando = false;
        this.carregar();
      },
      error: e => {
        this.erro = e.message ?? 'Falha ao criar';
        this.salvando = false;
      }
    });
  }

  excluir(id?: string) {
    if (!id) return;

    this.api.excluir(id).subscribe({
      next: () => this.carregar(),
      error: e => this.erro = e.message ?? 'Falha ao excluir'
    });
  }

  calcularSaldo() {
    this.totalEntradas = this.transacoes
      .filter(t => t.type === 'income')
      .reduce((soma, t) => soma + t.value, 0);

    this.totalSaidas = this.transacoes
      .filter(t => t.type === 'expense')
      .reduce((soma, t) => soma + t.value, 0);

    this.saldo = this.totalEntradas - this.totalSaidas;


  }

  get entradas(): Transacao[] {
    return this.transacoes.filter(t => t.type === 'income');
  }

  get saidas(): Transacao[] {
    return this.transacoes.filter(t => t.type === 'expense');
  }

  get entradasFiltradas() {
    return this.entradas.filter(t =>
      t.category.toLowerCase().includes(this.filtroCategoria.toLowerCase())
    );
  }
 
  get saidasFiltradas() {
    return this.saidas.filter(t =>
      t.category.toLowerCase().includes(this.filtroCategoria.toLowerCase())
    );
  }

}
