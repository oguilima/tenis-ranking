import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class JogadoresService {
    private jogadores: Jogador[] = [];
    private readonly logger = new Logger(JogadoresService.name)

    async criarAtualizarJogador(criaJogadorDto: CriarJogadorDto): Promise<void> {

        const { email } = criaJogadorDto

        const jogadorEncontrado =  this.jogadores.find(jogador => jogador.email === email)

        jogadorEncontrado ?  this.atualizar(jogadorEncontrado, criaJogadorDto) :  await this.criar(criaJogadorDto)
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return  this.jogadores
    }

    async consultarJogadoresPorEmail(email: string): Promise<Jogador>{
        const jogadorEncontrado = await this.jogadores.find(jogador => jogador.email === email)
        
        if(!jogadorEncontrado){
            throw new NotFoundException(`Jogador com email ${email} não foi encontrado`)
        }

        return jogadorEncontrado
    }

    async deletarJogador(email): Promise <void>{
        const jogadorEncontrado =  this.jogadores.find(jogador => jogador.email === email)
        this.jogadores = this.jogadores.filter(jogador => jogador.email !== jogadorEncontrado.email)


    }

    private criar(criaJogadorDto: CriarJogadorDto): void {
        const { nome, telefoneCelular, email } = criaJogadorDto

        const jogador: Jogador = {
            _id: uuidv4(),
            nome,
            telefoneCelular,
            email,
            ranking: 'A',
            posicaoRanking: 1,
            urlFotoJogador: "https://www.google.com/foto123.jpg"
        };

        this.logger.log(`criaJogadorDto: ${JSON.stringify(jogador)}`)

        this.jogadores.push(jogador);
    }

    private atualizar(jogadorEncontrado: Jogador, criaJogadorDto: CriarJogadorDto): void{
        const { nome } = criaJogadorDto

        jogadorEncontrado.nome = nome;
    }
}
