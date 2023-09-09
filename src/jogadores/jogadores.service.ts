import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class JogadoresService {
    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) { }

    async criarAtualizarJogador(criaJogadorDto: CriarJogadorDto): Promise<void> {

        const { email } = criaJogadorDto

        const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec()

        jogadorEncontrado ? this.atualizar(criaJogadorDto) : await this.criar(criaJogadorDto)
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        //return this.jogadores
        return await this.jogadorModel.find().exec()
    }

    async consultarJogadoresPorEmail(email: string): Promise<Jogador> {
        const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec()

        if (!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com email ${email} não foi encontrado`)
        }

        return jogadorEncontrado
    }

    async deletarJogador(email): Promise<any> {
        return await this.jogadorModel.deleteOne({ email }).exec()
    }

    private async criar(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
        const jogadorCriado = new this.jogadorModel(criaJogadorDto)
        return await jogadorCriado.save()
    }

    private async atualizar(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
        return await this.jogadorModel.findOneAndUpdate({ email: criaJogadorDto.email },
            { $set: criaJogadorDto }).exec()
    }
}
