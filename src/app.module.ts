import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://oguilima:LMs1Hpj21thjbujf@cluster0.lhumhyf.mongodb.net/?retryWrites=true&w=majority', {}),
    JogadoresModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
