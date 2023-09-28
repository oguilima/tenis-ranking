import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class JogadoresService {
    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) { }

    async criarJogador(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {

        const { email } = criaJogadorDto

        const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec()

        if (jogadorEncontrado) {
            throw new BadRequestException(`Jogador com email: ${email} já cadastrado`)
        }

        const jogadorCriado = new this.jogadorModel(criaJogadorDto)
        return await jogadorCriado.save()
    }


    async atualizarJogador(_id: string, atualizarJogadorDto: AtualizarJogadorDto): Promise<void> {
        const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec()

        if (!jogadorEncontrado) {
            throw new NotFoundException("Não foi encontrado um jogador para o id informado")
        }

        await this.jogadorModel.findOneAndUpdate({_id},
            { $set: atualizarJogadorDto }).exec()
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return await this.jogadorModel.find().exec()
    }

    async consultarJogadorPorId(_id: string): Promise<Jogador> {
        const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec()

        if (!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com id ${_id} não foi encontrado`)
        }

        return jogadorEncontrado
    }

    async deletarJogador(_id: string): Promise<any> {
        const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec()

        if (!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com id ${_id} não foi encontrado`)
        }

        return await this.jogadorModel.deleteOne({ _id }).exec()
    }
}