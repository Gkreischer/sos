import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatPhonePipe } from 'src/app/_pipes/format-phone.pipe';

@NgModule({
  declarations: [FormatPhonePipe],
  imports: [CommonModule],
  exports: [FormatPhonePipe],
})
export class PipesModule {}
