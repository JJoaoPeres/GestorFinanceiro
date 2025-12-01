import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Transacao {
  _id?: string;
  type: string;
  category: string;
  value: number;
  date: Date | string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class TransacaoService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/transacoes';


  listar(): Observable<Transacao[]> {
    return this.http.get<Transacao[]>(this.base);
  }


  buscarPorId(id: string): Observable<Transacao> {
    return this.http.get<Transacao>(`${this.base}/${id}`);
  }


  criar(transacao: Transacao): Observable<Transacao> {
    console.log(transacao);
    return this.http.post<Transacao>(this.base, transacao);
  }


  atualizar(id: string, transacao: Partial<Transacao>): Observable<Transacao> {
    return this.http.patch<Transacao>(`${this.base}/${id}`, transacao);
  }

  
  excluir(id: string) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
